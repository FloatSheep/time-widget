/* eslint-disable vue/one-component-per-file */
import { App, createApp, defineComponent, nextTick, ref, type ComponentPublicInstance } from 'vue'
import { inject } from 'vue'
import { css } from 'vite-css-in-js'

const popupSuccess = css`
  border-color: #9fd89f;
  background-color: #f1faf1;

  & > .popup-icon {
    color: #0e700e;
  }
`
const popupError = css`
  border-color: #eeacb2;
  background-color: #fdf3f4;

  & > .popup-icon {
    color: #b10e1c;
  }
`
const popupWarning = css`
  border-color: #fdcfb4;
  background-color: #fff9f5;

  & > .popup-icon {
    color: #bc4b09;
  }
`
const popupInfo = css`
  border-color: #d1d1d1;
  background-color: #f5f5f5;

  & > .popup-icon {
    color: #616161;
  }
`

const popStyles = css`
  white-space: nowrap;
  display: grid;
  grid-template: 'icon body secondaryActions actions' 1fr / auto 1fr auto auto;
  padding-left: 12px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  align-items: center;
  min-height: 36px;
  box-sizing: border-box;
  margin: 0;
  animation: fadeInDown 200ms cubic-bezier(0.33, 0, 0.67, 1);
  position: fixed;
  top: 10px;
  left: 50%;
  color: #000 !important;
  transform: translateX(-50%);
  z-index: 1000;

  &.fade-out {
    animation: fadeOutUp 200ms cubic-bezier(0.33, 0, 0.67, 1);
  }

  & > .popup-icon {
    grid-area: icon;
    font-size: 20px;
    margin-right: 8px;
    display: flex;
    align-items: center;

    & svg {
      display: inline;
      line-height: 0;
    }
  }

  & > .content-group {
    grid-area: body;
    padding-right: 12px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;

    & > .content-title {
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      margin-right: 0.2rem;
    }
  }

  & > .close-button {
    grid-area: actions;
    padding-right: 12px;

    & > .close-button-inside {
      max-width: 24px;
      max-height: 24px;
      font-size: 12px;
      color: #424242;
      border-color: transparent;
      background: transparent;
      line-height: 16px;
      font-weight: 400;
      padding: 1px;
      border-radius: 4px;

      &:hover {
        color: #115ea3;
        cursor: pointer;
      }

      & > .close-button-icon {
        width: 20px;
        height: 20px;
        font-size: 20px;
        align-items: center;
        display: inline-flex;
        justify-content: center;

        & svg {
          display: inline;
          line-height: 0;
        }
      }
    }
  }
`

const animationStyles = css`
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px) translateX(-50%);
    }
    to {
      opacity: 1;
      transform: translateY(0) translateX(-50%);
    }
  }

  @keyframes fadeOutUp {
    from {
      opacity: 1;
      transform: translateY(0) translateX(-50%);
    }
    to {
      opacity: 0;
      transform: translateY(-20px) translateX(-50%);
    }
  }
`

const PopupComponent = defineComponent({
  props: {
    title: {
      type: String,
      default: 'Info',
      required: false
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info'
    }
  },
  setup(_props, { expose }) {
    const visible = ref(true)
    const fadeOut = ref(false)

    const close = () => {
      fadeOut.value = true
      setTimeout(() => {
        visible.value = false
      }, 100)
    }

    expose({ close })

    return { visible, fadeOut, close }
  },
  render() {
    return this.visible ? (
      <div
        class={[
          'popup',
          this.fadeOut ? 'fade-out' : '',
          this.type === 'success' ? popupSuccess : '',
          this.type === 'error' ? popupError : '',
          this.type === 'warning' ? popupWarning : '',
          this.type === 'info' ? popupInfo : '',
          !this.type ? popupInfo : '',
          popStyles,
          animationStyles
        ]}
      >
        <div class="popup-icon">
          {this.type === 'info' && (
            <svg
              fill="currentColor"
              aria-hidden="true"
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 10a8 8 0 1 0-16 0 8 8 0 0 0 16 0ZM9.5 8.91a.5.5 0 0 1 1 0V13.6a.5.5 0 0 1-1 0V8.9Zm-.25-2.16a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z"
                fill="currentColor"
              ></path>
            </svg>
          )}
          {this.type === 'error' && (
            <svg
              fill="currentColor"
              aria-hidden="true"
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16ZM7.8 7.11a.5.5 0 0 0-.63.06l-.06.07a.5.5 0 0 0 .06.64L9.3 10l-2.12 2.12-.06.07a.5.5 0 0 0 .06.64l.07.06c.2.13.47.11.64-.06L10 10.7l2.12 2.12.07.06c.2.13.46.11.64-.06l.06-.07a.5.5 0 0 0-.06-.64L10.7 10l2.12-2.12.06-.07a.5.5 0 0 0-.06-.64l-.07-.06a.5.5 0 0 0-.64.06L10 9.3 7.88 7.17l-.07-.06Z"
                fill="currentColor"
              ></path>
            </svg>
          )}
          {this.type === 'success' && (
            <svg
              fill="currentColor"
              aria-hidden="true"
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm3.36 5.65a.5.5 0 0 0-.64-.06l-.07.06L9 11.3 7.35 9.65l-.07-.06a.5.5 0 0 0-.7.7l.07.07 2 2 .07.06c.17.11.4.11.56 0l.07-.06 4-4 .07-.08a.5.5 0 0 0-.06-.63Z"
                fill="currentColor"
              ></path>
            </svg>
          )}
          {this.type === 'warning' && (
            <svg
              fill="currentColor"
              aria-hidden="true"
              width="1em"
              height="1em"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.68 2.79a1.5 1.5 0 0 1 2.64 0l6.5 12A1.5 1.5 0 0 1 16.5 17h-13a1.5 1.5 0 0 1-1.32-2.21l6.5-12ZM10.5 7.5a.5.5 0 0 0-1 0v4a.5.5 0 0 0 1 0v-4Zm.25 6.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"
                fill="currentColor"
              ></path>
            </svg>
          )}
        </div>
        <div class="content-group">
          <span class="content-title">{this.title}</span>
          {this.content}
        </div>
        <div class="close-button">
          <button
            type="button"
            onClick={this.close}
            class="close-button-inside"
            aria-label="dismiss"
          >
            <span class="close-button-icon">
              <svg
                fill="currentColor"
                class="close-button-icon-svg"
                aria-hidden="true"
                width="1em"
                height="1em"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m4.09 4.22.06-.07a.5.5 0 0 1 .63-.06l.07.06L10 9.29l5.15-5.14a.5.5 0 0 1 .63-.06l.07.06c.18.17.2.44.06.63l-.06.07L10.71 10l5.14 5.15c.18.17.2.44.06.63l-.06.07a.5.5 0 0 1-.63.06l-.07-.06L10 10.71l-5.15 5.14a.5.5 0 0 1-.63.06l-.07-.06a.5.5 0 0 1-.06-.63l.06-.07L9.29 10 4.15 4.85a.5.5 0 0 1-.06-.63l.06-.07-.06.07Z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    ) : null
  }
})

type PopupType = 'info' | 'warning' | 'error' | 'success'

interface PopupExtends extends ComponentPublicInstance {
  close: () => void
}

const popupPlugin = {
  install(app: App) {
    const showPopup = ({
      title = 'Info',
      type = 'info',
      content
    }: {
      title?: string
      type?: PopupType
      content: string
    }) => {
      const container = document.createElement('div')
      document.body.appendChild(container)

      const popupApp = createApp(PopupComponent, { title, type, content })
      const popupInstance = popupApp.mount(container)

      nextTick(() => {
        setTimeout(() => {
          ;(popupInstance as unknown as PopupExtends).close()
          setTimeout(() => {
            popupApp.unmount()
            document.body.removeChild(container)
          }, 100)
        }, 2800)
      })
    }

    app.config.globalProperties.$popup = showPopup
    app.provide('popup', showPopup)
  }
}

interface PopupParams {
  title: string
  type?: PopupType
  content: string
}

const usePopup = () => {
  const popup = inject('popup') as (params: PopupParams) => void
  if (!popup) {
    throw new Error('usePopup must be used within a component that is wrapped with popupPlugin.')
  }
  return popup
}

export { popupPlugin, usePopup }
