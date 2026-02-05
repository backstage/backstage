import{aC as y,aD as w,aE as j,aF as M,a1 as O,r as p,j as t,m as G,e as C,K as Se,a2 as ve,d as E,F as he,H as fe}from"./iframe-M9O-K8SB.js";import{M as ge}from"./MenuBook-CIYxWfke.js";import{w as xe,A as Ie,c as Ce}from"./appWrappers-k5-JRCH3.js";import{b as $,S as q,m as ye,c as we,u as je,a as Me,d as re}from"./Page-ofKNp1l9.js";import{l as Oe}from"./lodash-Czox7iJy.js";import{a as ne,i as Y,A as qe,b as _e,c as oe,d as L,S as H,e as ae,f as Re,g as ke}from"./Items-CWDzJntQ.js";import{L as Q}from"./Link-Btc0GL0z.js";import{u as V,g as De,r as Te}from"./index-CuiKZooy.js";import{B as Pe,a as Ae}from"./BottomNavigationAction-qXd83s5d.js";import{D as He}from"./Drawer-DP4gp4jh.js";import{B as I}from"./Box-DrVgjJoD.js";import{u as Be}from"./useElementFilter-D-bjtJAi.js";import{u as ze}from"./useMediaQuery-BeVqOIt1.js";import{B as ie}from"./Button-JPiqA3bT.js";import{T as F}from"./Tooltip-Bg-nqDOZ.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-CuDF8Tct.js";import"./useIsomorphicLayoutEffect-9yTSWmeM.js";import"./useAnalytics-8ya555GT.js";import"./useAsync-CFnaQwpM.js";import"./useMountedState-CLl1ZXx0.js";import"./componentData-lwFigNXQ.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useApp-Citse85p.js";import"./Search-CDtZj0Ia.js";import"./ArrowBackIos-DowBizyB.js";import"./ArrowForwardIos-8_88FHkt.js";import"./index-rR4Pt6og.js";import"./TextField-Dl4vLPoK.js";import"./Select-ByRkfEZ7.js";import"./index-B9sM2jn7.js";import"./Popover-9y8CeMZr.js";import"./Modal-Bu63BRBX.js";import"./Portal-B9990TVI.js";import"./List-DFXlWgcm.js";import"./ListContext-CQy2fJuy.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CnxnhVyN.js";import"./FormLabel-CaD7F1Na.js";import"./InputLabel-BRgQ3qkL.js";import"./Badge-D6Jdq7-i.js";import"./Backdrop-D_SJu6io.js";import"./styled-Ddkk_tuK.js";import"./Popper-BxqJldSX.js";var _={},K;function Ne(){if(K)return _;K=1;var e=y(),r=w();Object.defineProperty(_,"__esModule",{value:!0}),_.default=void 0;var a=r(j()),i=e(M()),n=(0,i.default)(a.createElement("path",{d:"M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"}),"AddCircleOutline");return _.default=n,_}var Ee=Ne();const se=O(Ee);var R={},X;function Le(){if(X)return R;X=1;var e=y(),r=w();Object.defineProperty(R,"__esModule",{value:!0}),R.default=void 0;var a=r(j()),i=e(M()),n=(0,i.default)(a.createElement("path",{d:"M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"}),"Menu");return R.default=n,R}var Ge=Le();const U=O(Ge),de=p.createContext({selectedMenuItemIndex:-1,setSelectedMenuItemIndex:()=>{}}),We=G(e=>({root:{flexGrow:0,margin:e.spacing(0,2),color:e.palette.navigation.color},selected:r=>({color:`${e.palette.navigation.selectedColor}!important`,borderTop:`solid ${r.sidebarConfig.selectedIndicatorWidth}px ${e.palette.navigation.indicator}`,marginTop:"-1px"}),label:{display:"none"}})),Fe=e=>{const{to:r,label:a,icon:i,value:n}=e,{sidebarConfig:s}=p.useContext(q),d=We({sidebarConfig:s}),o=V(),{selectedMenuItemIndex:c,setSelectedMenuItemIndex:u}=p.useContext(de),l=(g,S)=>{u(S===c?-1:S)},f=n===c&&c>=0||n!==c&&!(c>=0)&&r===o.pathname;return t.jsx(Pe,{"aria-label":a,label:a,icon:i,component:Q,to:r||o.pathname,onChange:l,value:n,selected:f,classes:d})},B=e=>{const{children:r,to:a,label:i,icon:n,value:s}=e,{isMobile:d}=$();return d?t.jsx(Fe,{to:a,label:i,icon:n,value:s}):t.jsx(t.Fragment,{children:r})};B.__docgenInfo={description:`Groups items of the \`Sidebar\` together.

@remarks
On bigger screens, this won't have any effect at the moment.
On small screens, it will add an action to the bottom navigation - either triggering an overlay menu or acting as a link

@public`,methods:[],displayName:"SidebarGroup",props:{to:{required:!1,tsType:{name:"string"},description:"If the `SidebarGroup` should be a `Link`, `to` should be a pathname to that location"},priority:{required:!1,tsType:{name:"number"},description:"If the `SidebarGroup`s should be in a different order than in the normal `Sidebar`, you can provide\neach `SidebarGroup` it's own priority to reorder them."},children:{required:!1,tsType:{name:"ReactNode"},description:"React children"}},composes:["BottomNavigationActionProps"]};const le=G(e=>({root:{position:"fixed",backgroundColor:e.palette.navigation.background,color:e.palette.navigation.color,bottom:0,left:0,right:0,zIndex:e.zIndex.snackbar,borderTop:"1px solid #383838","@media print":{display:"none"}},overlay:r=>({background:e.palette.navigation.background,width:"100%",bottom:`${r.sidebarConfig.mobileSidebarHeight}px`,height:`calc(100% - ${r.sidebarConfig.mobileSidebarHeight}px)`,flex:"0 1 auto",overflow:"auto"}),overlayHeader:{display:"flex",color:e.palette.navigation.color,alignItems:"center",justifyContent:"space-between",padding:e.spacing(2,3)},overlayHeaderClose:{color:e.palette.navigation.color},marginMobileSidebar:r=>({marginBottom:`${r.sidebarConfig.mobileSidebarHeight}px`})})),Qe=e=>Oe.orderBy(e,({props:{priority:r}})=>Number.isInteger(r)?r:-1,"desc"),$e=p.createElement(B).type,Ve=({children:e,label:r="Menu",open:a,onClose:i})=>{const{sidebarConfig:n}=p.useContext(q),s=le({sidebarConfig:n});return t.jsxs(He,{anchor:"bottom",open:a,onClose:i,ModalProps:{BackdropProps:{classes:{root:s.marginMobileSidebar}}},classes:{root:s.marginMobileSidebar,paperAnchorBottom:s.overlay},children:[t.jsxs(I,{className:s.overlayHeader,children:[t.jsx(C,{variant:"h3",children:r}),t.jsx(Se,{onClick:i,classes:{root:s.overlayHeaderClose},children:t.jsx(ve,{})})]}),t.jsx(I,{component:"nav",children:e})]})},ce=e=>{const{sidebarConfig:r}=p.useContext(q),{children:a}=e,i=le({sidebarConfig:r}),n=V(),[s,d]=p.useState(-1);p.useEffect(()=>{d(-1)},[n.pathname]);let o=Be(a,u=>u.getElements().filter(l=>l.type===$e));if(a)o.length?o=Qe(o):o.push(t.jsx(B,{icon:t.jsx(U,{}),children:a},"default_menu"));else return null;const c=s>=0&&!o[s].props.to;return t.jsx(ne,{value:{isOpen:!0,setOpen:()=>{}},children:t.jsxs(de.Provider,{value:{selectedMenuItemIndex:s,setSelectedMenuItemIndex:d},children:[t.jsx(Ve,{label:o[s]&&o[s].props.label,open:c,onClose:()=>d(-1),children:o[s]&&o[s].props.children}),t.jsx(Ae,{className:i.root,"data-testid":"mobile-sidebar-root",component:"nav",children:o})]})})};ce.__docgenInfo={description:`A navigation component for mobile screens, which sticks to the bottom.

@remarks
It alternates the normal sidebar by grouping the \`SidebarItems\` based on provided \`SidebarGroup\`s
either rendering them as a link or an overlay menu.
If no \`SidebarGroup\`s are provided the sidebar content is wrapped in an default overlay menu.

@public`,methods:[],displayName:"MobileSidebar",props:{children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const ue=G(e=>({root:{left:0,top:0,bottom:0,zIndex:e.zIndex.appBar,position:"fixed"},drawer:{display:"flex",flexFlow:"column nowrap",alignItems:"flex-start",left:0,top:0,bottom:0,position:"absolute",background:e.palette.navigation.background,overflowX:"hidden",msOverflowStyle:"none",scrollbarWidth:"none",transition:e.transitions.create("width",{easing:e.transitions.easing.sharp,duration:e.transitions.duration.shortest}),"& > *":{flexShrink:0},"&::-webkit-scrollbar":{display:"none"},"@media print":{display:"none"}},drawerWidth:r=>({width:r.sidebarConfig.drawerWidthClosed}),drawerOpen:r=>({width:r.sidebarConfig.drawerWidthOpen,transition:e.transitions.create("width",{easing:e.transitions.easing.sharp,duration:e.transitions.duration.shorter})}),visuallyHidden:{top:0,position:"absolute",zIndex:1e3,transform:"translateY(-200%)","&:focus":{transform:"translateY(5px)"}}}),{name:"BackstageSidebar"}),b={Closed:0,Idle:1,Open:2},Ue=e=>{const{sidebarConfig:r}=p.useContext(q),{openDelayMs:a=r.defaultOpenDelayMs,closeDelayMs:i=r.defaultCloseDelayMs,disableExpandOnHover:n,children:s}=e,d=ue({sidebarConfig:r}),o=ze(x=>x.breakpoints.down("md"),{noSsr:!0}),[c,u]=p.useState(b.Closed),l=p.useRef(),{isPinned:f,toggleSidebarPinState:g}=$(),S=()=>{f||n||(l.current&&(clearTimeout(l.current),l.current=void 0),c!==b.Open&&!o&&(l.current=window.setTimeout(()=>{l.current=void 0,u(b.Open)},a),u(b.Idle)))},z=()=>{f||n||(l.current&&(clearTimeout(l.current),l.current=void 0),c===b.Idle?u(b.Closed):c===b.Open&&(l.current=window.setTimeout(()=>{l.current=void 0,u(b.Closed)},i)))},N=c===b.Open&&!o||f,m=x=>{x?(u(b.Open),g()):(u(b.Closed),g())};return t.jsxs("nav",{style:{},"aria-label":"sidebar nav",children:[t.jsx(Ye,{}),t.jsx(ne,{value:{isOpen:N,setOpen:m},children:t.jsx(I,{className:d.root,"data-testid":"sidebar-root",onMouseEnter:n?()=>{}:S,onFocus:n?()=>{}:S,onMouseLeave:n?()=>{}:z,onBlur:n?()=>{}:z,children:t.jsx(I,{className:E(d.drawer,d.drawerWidth,{[d.drawerOpen]:N}),children:s})})})]})},W=e=>{const r=ye(e.sidebarOptions??{}),a=we(e.submenuOptions??{}),{children:i,disableExpandOnHover:n,openDelayMs:s,closeDelayMs:d}=e,{isMobile:o}=$();return o?t.jsx(ce,{children:i}):t.jsx(q.Provider,{value:{sidebarConfig:r,submenuConfig:a},children:t.jsx(Ue,{openDelayMs:s,closeDelayMs:d,disableExpandOnHover:n,children:i})})};function Ye(){const{sidebarConfig:e}=p.useContext(q),{focusContent:r,contentRef:a}=je(),i=ue({sidebarConfig:e}),{t:n}=he(fe);return a?.current?t.jsx(ie,{onClick:r,variant:"contained",className:E(i.visuallyHidden),children:n("skipToContent")}):null}W.__docgenInfo={description:`Passing children into the desktop or mobile sidebar depending on the context

@public`,methods:[],displayName:"Sidebar",props:{openDelayMs:{required:!1,tsType:{name:"number"},description:""},closeDelayMs:{required:!1,tsType:{name:"number"},description:""},sidebarOptions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  drawerWidthClosed?: number;
  drawerWidthOpen?: number;
}`,signature:{properties:[{key:"drawerWidthClosed",value:{name:"number",required:!1}},{key:"drawerWidthOpen",value:{name:"number",required:!1}}]}},description:""},submenuOptions:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  drawerWidthClosed?: number;
  drawerWidthOpen?: number;
}`,signature:{properties:[{key:"drawerWidthClosed",value:{name:"number",required:!1}},{key:"drawerWidthOpen",value:{name:"number",required:!1}}]}},description:""},disableExpandOnHover:{required:!1,tsType:{name:"boolean"},description:""},children:{required:!1,tsType:{name:"ReactNode"},description:""}}};const Ke=G(e=>({item:{height:48,width:"100%","&:hover":{background:e.palette.navigation.navItem?.hoverBackground||"#6f6f6f",color:e.palette.navigation.selectedColor},display:"flex",alignItems:"center",color:e.palette.navigation.color,padding:e.spacing(2.5),cursor:"pointer",position:"relative",background:"none",border:"none"},itemContainer:{width:"100%"},selected:{background:"#6f6f6f",color:e.palette.common.white},label:{margin:e.spacing(1.75),marginLeft:e.spacing(1),fontSize:e.typography.body2.fontSize,whiteSpace:"nowrap",overflow:"hidden","text-overflow":"ellipsis",lineHeight:1},subtitle:{fontSize:10,whiteSpace:"nowrap",overflow:"hidden","text-overflow":"ellipsis"},dropdownArrow:{position:"absolute",right:21},dropdown:{display:"flex",flexDirection:"column",alignItems:"end"},dropdownItem:{width:"100%",padding:"10px 0 10px 0","&:hover":{background:e.palette.navigation.navItem?.hoverBackground||"#6f6f6f",color:e.palette.navigation.selectedColor}},dropdownButton:{textTransform:"none",justifyContent:"flex-start"},textContent:{color:e.palette.navigation.color,paddingLeft:e.spacing(4),paddingRight:e.spacing(1),fontSize:e.typography.body2.fontSize,whiteSpace:"nowrap",overflow:"hidden","text-overflow":"ellipsis"}}),{name:"BackstageSidebarSubmenuItem"}),A=e=>{const{title:r,subtitle:a,to:i,icon:n,dropdownItems:s,exact:d}=e,o=Ke(),{setIsHoveredOn:c}=p.useContext(Me),u=()=>{c(!1)},l=De(i??""),f=V();let g=Y(f,l,d);const[S,z]=p.useState(e.initialShowDropdown??!1),N=()=>{z(!S)};return s!==void 0?(s.some(m=>{const x=Te(m.to);return g=Y(f,x,d),g}),t.jsxs(I,{className:o.itemContainer,children:[t.jsx(F,{title:r,enterDelay:500,enterNextDelay:500,children:t.jsxs(ie,{role:"button",onClick:N,onTouchStart:m=>m.stopPropagation(),className:E(o.item,o.dropdownButton,g?o.selected:void 0),children:[n&&t.jsx(n,{fontSize:"small"}),t.jsxs(C,{variant:"subtitle1",component:"span",className:o.label,children:[r,t.jsx("br",{}),a&&t.jsx(C,{variant:"caption",component:"span",className:o.subtitle,children:a})]}),S?t.jsx(qe,{className:o.dropdownArrow}):t.jsx(_e,{className:o.dropdownArrow})]})}),s&&S&&t.jsx(I,{className:o.dropdown,children:s.map((m,x)=>t.jsx(F,{title:m.title,enterDelay:500,enterNextDelay:500,children:t.jsx(Q,{to:m.to,underline:"none",className:o.dropdownItem,onClick:u,onTouchStart:be=>be.stopPropagation(),children:t.jsx(C,{component:"span",className:o.textContent,children:m.title})})},x))})]})):t.jsx(I,{className:o.itemContainer,children:t.jsx(F,{title:r,enterDelay:500,enterNextDelay:500,children:t.jsxs(Q,{to:i,underline:"none",className:E(o.item,g?o.selected:void 0),onClick:u,onTouchStart:m=>m.stopPropagation(),children:[n&&t.jsx(n,{fontSize:"small"}),t.jsxs(C,{variant:"subtitle1",component:"span",className:o.label,children:[r,t.jsx("br",{}),a&&t.jsx(C,{variant:"caption",component:"span",className:o.subtitle,children:a})]})]})})})};A.__docgenInfo={description:`Item used inside a submenu within the sidebar.

@public`,methods:[],displayName:"SidebarSubmenuItem",props:{title:{required:!0,tsType:{name:"string"},description:""},subtitle:{required:!1,tsType:{name:"string"},description:""},to:{required:!1,tsType:{name:"string"},description:""},icon:{required:!1,tsType:{name:"ComponentType",elements:[{name:"signature",type:"object",raw:`{
  fontSize?: 'medium' | 'large' | 'small' | 'inherit';
}`,signature:{properties:[{key:"fontSize",value:{name:"union",raw:"'medium' | 'large' | 'small' | 'inherit'",elements:[{name:"literal",value:"'medium'"},{name:"literal",value:"'large'"},{name:"literal",value:"'small'"},{name:"literal",value:"'inherit'"}],required:!1}}]}}],raw:`ComponentType<{
  fontSize?: 'medium' | 'large' | 'small' | 'inherit';
}>`},description:""},dropdownItems:{required:!1,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  title: string;
  to: string;
}`,signature:{properties:[{key:"title",value:{name:"string",required:!0}},{key:"to",value:{name:"string",required:!0}}]}}],raw:"SidebarSubmenuItemDropdownItem[]"},description:""},exact:{required:!1,tsType:{name:"boolean"},description:""},initialShowDropdown:{required:!1,tsType:{name:"boolean"},description:""}}};var k={},J;function Xe(){if(J)return k;J=1;var e=y(),r=w();Object.defineProperty(k,"__esModule",{value:!0}),k.default=void 0;var a=r(j()),i=e(M()),n=(0,i.default)(a.createElement("path",{d:"M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"}),"HomeOutlined");return k.default=n,k}var Je=Xe();const pe=O(Je);var D={},Z;function Ze(){if(Z)return D;Z=1;var e=y(),r=w();Object.defineProperty(D,"__esModule",{value:!0}),D.default=void 0;var a=r(j()),i=e(M()),n=(0,i.default)(a.createElement("path",{d:"M12.09 2.91C10.08.9 7.07.49 4.65 1.67L8.28 5.3c.39.39.39 1.02 0 1.41L6.69 8.3c-.39.4-1.02.4-1.41 0L1.65 4.67C.48 7.1.89 10.09 2.9 12.1c1.86 1.86 4.58 2.35 6.89 1.48l7.96 7.96c1.03 1.03 2.69 1.03 3.71 0 1.03-1.03 1.03-2.69 0-3.71L13.54 9.9c.92-2.34.44-5.1-1.45-6.99z"}),"BuildRounded");return D.default=n,D}var et=Ze();const tt=O(et);var T={},ee;function rt(){if(ee)return T;ee=1;var e=y(),r=w();Object.defineProperty(T,"__esModule",{value:!0}),T.default=void 0;var a=r(j()),i=e(M()),n=(0,i.default)(a.createElement("path",{d:"M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z"}),"CloudQueue");return T.default=n,T}var nt=rt();const ot=O(nt);var P={},te;function at(){if(te)return P;te=1;var e=y(),r=w();Object.defineProperty(P,"__esModule",{value:!0}),P.default=void 0;var a=r(j()),i=e(M()),n=(0,i.default)(a.createElement("path",{d:"M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"}),"Apps");return P.default=n,P}var it=at();const st=O(it),dt=Ce({id:"storybook.test-route"}),tr={title:"Layout/Sidebar",component:W,decorators:[e=>xe(t.jsx(e,{}),{mountedRoutes:{"/":dt}})],tags:["!manifest"]},me=e=>{console.log(e)},v=()=>t.jsx(re,{children:t.jsx(W,{children:t.jsxs(B,{label:"Menu",icon:t.jsx(U,{}),children:[t.jsx(oe,{onSearch:me,to:"/search"}),t.jsx(L,{}),t.jsx(H,{icon:pe,to:"#",text:"Plugins"}),t.jsx(H,{icon:se,to:"#",text:"Create..."}),t.jsx(L,{}),t.jsx(ae,{})]})})}),h=()=>t.jsx(re,{children:t.jsxs(W,{disableExpandOnHover:!0,children:[t.jsx(oe,{onSearch:me,to:"/search"}),t.jsx(L,{}),t.jsxs(B,{label:"Menu",icon:t.jsx(U,{}),children:[t.jsx(H,{icon:ge,text:"Catalog",children:t.jsxs(Re,{title:"Catalog",children:[t.jsx(A,{title:"Tools",to:"/1",icon:tt}),t.jsx(A,{title:"APIs",to:"/2",icon:ot}),t.jsx(A,{title:"Components",to:"/3",icon:st}),t.jsx(A,{title:"Misc",to:"/6",icon:Ie,dropdownItems:[{title:"Lorem Ipsum",to:"/7"},{title:"Lorem Ipsum",to:"/8"}]})]})}),t.jsx(H,{icon:pe,to:"#",text:"Plugins"}),t.jsx(H,{icon:se,to:"#",text:"Create..."})]}),t.jsx(L,{}),t.jsx(ae,{}),t.jsx(ke,{})]})});v.__docgenInfo={description:"",methods:[],displayName:"SampleSidebar"};h.__docgenInfo={description:"",methods:[],displayName:"SampleScalableSidebar"};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{code:`const SampleSidebar = () => (
  <SidebarPage>
    <Sidebar>
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarSearchField onSearch={handleSearch} to="/search" />
        <SidebarDivider />
        <SidebarItem icon={HomeOutlinedIcon} to="#" text="Plugins" />
        <SidebarItem icon={AddCircleOutlineIcon} to="#" text="Create..." />
        <SidebarDivider />
        <SidebarSpace />
      </SidebarGroup>
    </Sidebar>
  </SidebarPage>
);
`,...v.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{code:`const SampleScalableSidebar = () => (
  <SidebarPage>
    <Sidebar disableExpandOnHover>
      <SidebarSearchField onSearch={handleSearch} to="/search" />
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarItem icon={MenuBookIcon} text="Catalog">
          <SidebarSubmenu title="Catalog">
            <SidebarSubmenuItem title="Tools" to="/1" icon={BuildRoundedIcon} />
            <SidebarSubmenuItem title="APIs" to="/2" icon={CloudQueueIcon} />
            <SidebarSubmenuItem title="Components" to="/3" icon={AppsIcon} />
            <SidebarSubmenuItem
              title="Misc"
              to="/6"
              icon={AcUnitIcon}
              dropdownItems={[
                {
                  title: "Lorem Ipsum",
                  to: "/7",
                },
                {
                  title: "Lorem Ipsum",
                  to: "/8",
                },
              ]}
            />
          </SidebarSubmenu>
        </SidebarItem>
        <SidebarItem icon={HomeOutlinedIcon} to="#" text="Plugins" />
        <SidebarItem icon={AddCircleOutlineIcon} to="#" text="Create..." />
      </SidebarGroup>
      <SidebarDivider />
      <SidebarSpace />
      <SidebarExpandButton />
    </Sidebar>
  </SidebarPage>
);
`,...h.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`() => <SidebarPage>
    <Sidebar>
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarSearchField onSearch={handleSearch} to="/search" />
        <SidebarDivider />
        <SidebarItem icon={HomeOutlinedIcon} to="#" text="Plugins" />
        <SidebarItem icon={AddCircleOutlineIcon} to="#" text="Create..." />
        <SidebarDivider />
        <SidebarSpace />
      </SidebarGroup>
    </Sidebar>
  </SidebarPage>`,...v.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`() => <SidebarPage>
    <Sidebar disableExpandOnHover>
      <SidebarSearchField onSearch={handleSearch} to="/search" />
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarItem icon={MenuBookIcon} text="Catalog">
          <SidebarSubmenu title="Catalog">
            <SidebarSubmenuItem title="Tools" to="/1" icon={BuildRoundedIcon} />
            <SidebarSubmenuItem title="APIs" to="/2" icon={CloudQueueIcon} />
            <SidebarSubmenuItem title="Components" to="/3" icon={AppsIcon} />
            <SidebarSubmenuItem title="Misc" to="/6" icon={AcUnitIcon} dropdownItems={[{
            title: 'Lorem Ipsum',
            to: '/7'
          }, {
            title: 'Lorem Ipsum',
            to: '/8'
          }]} />
          </SidebarSubmenu>
        </SidebarItem>
        <SidebarItem icon={HomeOutlinedIcon} to="#" text="Plugins" />
        <SidebarItem icon={AddCircleOutlineIcon} to="#" text="Create..." />
      </SidebarGroup>
      <SidebarDivider />
      <SidebarSpace />
      <SidebarExpandButton />
    </Sidebar>
  </SidebarPage>`,...h.parameters?.docs?.source}}};const rr=["SampleSidebar","SampleScalableSidebar"];export{h as SampleScalableSidebar,v as SampleSidebar,rr as __namedExportsOrder,tr as default};
