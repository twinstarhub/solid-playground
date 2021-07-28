import { Icon } from '@amoutonbrady/solid-heroicons';
import { zoomIn } from '@amoutonbrady/solid-heroicons/outline';
import { Component, createSignal, Show, createEffect } from 'solid-js';
import useFocusOut from '../../src/hooks/useFocusOut';
import useZoom from '../../src/hooks/useZoom';

export const ZoomDropdown: Component<{ showMenu: boolean }> = (props) => {
  const [[toggle, setToggle], { onFOBlur, onFOClick, onFOFocus }] = useFocusOut();
  const { zoomState, updateZoomScale, updateZoomSettings } = useZoom();
  const popupDuration = 1250;
  let containerEl!: HTMLDivElement;
  let prevZoom = zoomState.zoom;
  let timeoutId: number | null = null;
  let btnEl!: HTMLButtonElement;
  let prevFocusedEl: HTMLElement | null;
  let stealFocus = true;

  const onMouseMove = () => {
    stealFocus = true;
    window.clearTimeout(timeoutId!);
  };

  const onKeyDownContainer = (e: KeyboardEvent) => {
    if (!toggle()) return;

    if (e.key === 'Escape' && !stealFocus) {
      if (prevFocusedEl) {
        prevFocusedEl.focus();
        stealFocus = true;
      }
      window.clearTimeout(timeoutId!);
    }

    if (!['Tab', 'Enter', 'Space'].includes(e.key)) return;
    stealFocus = false;
    prevFocusedEl = null;
    window.clearTimeout(timeoutId!);
  };

  createEffect(() => {
    if (prevZoom === zoomState.zoom) return;
    prevZoom = zoomState.zoom;

    if (stealFocus) {
      prevFocusedEl = document.activeElement as HTMLElement;
      btnEl.focus();
      stealFocus = false;
    }

    setToggle(true);

    window.clearTimeout(timeoutId!);

    timeoutId = setTimeout(() => {
      setToggle(false);

      stealFocus = true;
      if (prevFocusedEl) {
        prevFocusedEl.focus();
      }
    }, popupDuration);
  });

  createEffect(() => {
    if (!toggle()) {
      if (containerEl) {
        containerEl.removeEventListener('mousemove', onMouseMove);
      }
      stealFocus = true;
    } else {
      if (containerEl) {
        containerEl.addEventListener('mousemove', onMouseMove, { once: true });
      }
    }
  });

  return (
    <div
      class="relative"
      onFocusIn={onFOFocus}
      onFocusOut={onFOBlur}
      onKeyDown={onKeyDownContainer}
      onClick={() => {
        window.clearTimeout(timeoutId!);
      }}
      ref={containerEl}
      tabindex="-1"
    >
      <button
        type="button"
        class="text-black md:text-white flex flex-row space-x-2 items-center w-full md:px-3 px-2 py-2 focus:ring-1 rounded text-white opacity-80 hover:opacity-100"
        classList={{
          'bg-gray-900': toggle() && !props.showMenu,
          'bg-gray-300': toggle() && props.showMenu,
          'rounded-none	active:bg-gray-300 hover:bg-gray-300 focus:outline-none focus:highlight-none active:highlight-none focus:ring-0 active:outline-none':
            props.showMenu,
        }}
        onClick={onFOClick}
        title="Scale editor to make text larger or smaller"
        ref={btnEl}
      >
        <Icon class="h-6" path={zoomIn} />
        <span class="text-xs md:sr-only">Scale Editor</span>
      </button>
      <Show when={toggle()}>
        <div
          class="absolute top-full left-1/2 bg-white text-brand-default border border-gray-900 rounded shadow  p-6 -translate-x-1/2 z-10"
          classList={{
            'left-1/4': props.showMenu,
          }}
        >
          <div class="flex">
            <button
              class="bg-gray-500 text-white px-3 py-1 rounded-l text-sm uppercase tracking-wide hover:bg-gray-800"
              aria-label="decrease font size"
              onClick={() => updateZoomScale('decrease')}
            >
              -
            </button>
            <div class="text-black bg-gray-100 px-3 py-1 text-sm text-center w-20 uppercase tracking-wide ">
              {zoomState.zoom}%
            </div>
            <button
              class="bg-gray-500 text-white px-3 py-1 rounded-r text-sm uppercase tracking-wide mr-4 hover:bg-gray-800"
              aria-label="increase font size"
              onClick={() => updateZoomScale('increase')}
            >
              +
            </button>
            <button
              class="bg-gray-500 text-white px-3 py-1 rounded  text-sm uppercase tracking-wide hover:bg-gray-800"
              aria-label="reset font size"
              onClick={() => updateZoomScale('reset')}
            >
              Reset
            </button>
          </div>
          <div className="mt-10">
            <label class="block my-3 cursor-pointer">
              <input
                type="checkbox"
                class="mr-4 cursor-pointer"
                checked={zoomState.overrideNative}
                onChange={(e) => updateZoomSettings('overrideNative', e.currentTarget.checked)}
              />
              Override native zoom keyboard shortcut
            </label>
            <label class="block my-3 cursor-pointer">
              <input
                type="checkbox"
                class="mr-4 cursor-pointer"
                checked={zoomState.scaleIframe}
                onChange={(e) => updateZoomSettings('scaleIframe', e.currentTarget.checked)}
              />
              Scale iframe <strong>Result</strong>
            </label>
          </div>
        </div>
      </Show>
    </div>
  );
};
