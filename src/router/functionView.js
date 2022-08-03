import errorView from "@/view/functionView/404/404";
import noPermission from "@/view/functionView/noPermission/noPermission";

export default [
    {
        path: 'errorView',
        name: 'errorView',
        component: errorView,
    },
    {
        path: 'noPermission',
        name: 'noPermission',
        component: noPermission,
    }
]