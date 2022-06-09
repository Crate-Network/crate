import { IconProp } from "@fortawesome/fontawesome-svg-core"
import {
  faArrowRightFromBracket,
  faBell,
  faBox,
  faCircleNodes,
  faDashboard,
  faFileInvoiceDollar,
  faLock,
  faNetworkWired,
  faSliders,
  faUser,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import AuthContext, { AuthObject } from "context/AuthContext"
import { route } from "preact-router"
import { useContext, useState } from "preact/hooks"
import Account from "../components/settings/Account"
import Security from "../components/settings/Security"

function SidebarButton({
  selected,
  icon,
  text,
  onClick,
}: {
  selected?: boolean
  icon: IconProp
  text: string
  onClick: () => void
}) {
  return (
    <li onClick={onClick}>
      <a
        href="#"
        className={`flex items-center space-x-3 justify-between text-gray-700 dark:text-stone-200 p-2 rounded-md font-medium ${
          selected
            ? "bg-gray-200 dark:bg-stone-700"
            : "hover:bg-gray-100 dark:hover:bg-stone-600 focus:bg-gray-200 focus:dark:bg-stone-700"
        }  focus:shadow-outline`}
      >
        <span className="space-x-3">
          <span className="text-gray-600 dark:text-stone-300">
            <FontAwesomeIcon className="w-5 scale-110" icon={icon} />
          </span>
          <span>{text}</span>
        </span>
        {selected && <span className="bg-orange-400 w-0.5 h-5 block" />}
      </a>
    </li>
  )
}

enum Pane {
  NETWORK,
  NOTIFICATIONS,
  BILLING,
  ACCOUNT,
  SECURITY,
  STORAGE,
}

export default function Settings() {
  const { db, user, logout } = useContext<AuthObject>(AuthContext)
  const [selectedPane, setSelectedPane] = useState(Pane.ACCOUNT)

  function getProps(pane: Pane) {
    const o = {
      selected: pane === selectedPane,
      onClick: () => {
        setSelectedPane(pane)
      },
    }
    switch (pane) {
      case Pane.NETWORK:
        return { ...o, icon: faCircleNodes, text: "Network" }
      case Pane.NOTIFICATIONS:
        return { ...o, icon: faBell, text: "Notifications" }
      case Pane.BILLING:
        return { ...o, icon: faFileInvoiceDollar, text: "Plan & Billing" }
      case Pane.ACCOUNT:
        return { ...o, icon: faUser, text: "Profile" }
      case Pane.SECURITY:
        return { ...o, icon: faLock, text: "Security" }
      case Pane.STORAGE:
        return { ...o, icon: faBox, text: "Storage" }
    }
  }

  function getPane(pane: Pane) {
    switch (pane) {
      case Pane.ACCOUNT:
        return <Account />
      case Pane.SECURITY:
        return <Security />
      default:
        return <span>Content Here</span>
    }
  }

  if (!user)
    return <div className="text-center w-full italic mt-6">Loading...</div>

  const { firstName, lastName, organization } = user.doc

  return (
    <main className="mt-6 sm:mt-12 md:mt-16 lg:mt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="font-iaQuattro lg:text-5xl lg:mb-8 mb-3 text-4xl font-bold">
        Settings
      </h1>
      <div className="flex flex-wrap w-full rounded-lg">
        <div className="w-5/12 lg:w-4/12 xl:w-3/12 bg-white dark:bg-stone-800 rounded-lg p-3 shadow-lg">
          {user.email !== "" && (
            <div className="flex items-center space-x-4 p-2 mb-5">
              <div className="h-12 w-12 bg-slate-200 dark:bg-stone-700 rounded-full flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="overflow-ellipsis overflow-hidden whitespace-nowrap">
                <h4 className="overflow-ellipsis overflow-hidden whitespace-nowrap w-full font-semibold text-md text-gray-700 dark:text-gray-100 font-poppins tracking-wide">
                  {firstName !== "" ? `${firstName} ${lastName}` : user.email}
                </h4>
                {organization !== "" && (
                  <span className="overflow-ellipsis overflow-hidden whitespace-nowraptext-sm tracking-wide flex items-center space-x-1">
                    <span className="text-gray-600 dark:text-gray-200 text-md">
                      {organization}
                    </span>
                  </span>
                )}
              </div>
            </div>
          )}
          <ul className="space-y-2 text-sm">
            <SidebarButton {...getProps(Pane.ACCOUNT)} />
            <SidebarButton {...getProps(Pane.SECURITY)} />
            <SidebarButton {...getProps(Pane.BILLING)} />
            <SidebarButton {...getProps(Pane.STORAGE)} />
            <SidebarButton {...getProps(Pane.NETWORK)} />
            <SidebarButton {...getProps(Pane.NOTIFICATIONS)} />
            <SidebarButton
              icon={faArrowRightFromBracket}
              text="Logout"
              onClick={() => {
                logout()
                route("/", true)
              }}
            />
          </ul>
        </div>

        <div className="w-7/12 lg:w-8/12 xl:w-9/12 rounded-md ">
          <div className="p-6 ml-4 rounded-md bg-white dark:bg-stone-800 dark:text-white text-neutral-900">
            {getPane(selectedPane)}
          </div>
        </div>
      </div>
    </main>
  )
}
