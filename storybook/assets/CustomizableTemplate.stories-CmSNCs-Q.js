import{j as t,T as i,c as m,C as a}from"./iframe-C4yti0TH.js";import{w as n}from"./appWrappers-CHKMDW6u.js";import{s as p,H as s}from"./plugin-BL8kxZNU.js";import{c as d}from"./api-BfuP0HRM.js";import{c}from"./catalogApiMock-Bb-xugnS.js";import{M as g}from"./MockStarredEntitiesApi-Du1ej0kb.js";import{s as l}from"./api-DA5O3fCt.js";import{C as h}from"./CustomHomepageGrid-D4VWDebO.js";import{H as f,a as u}from"./plugin-DzdQwfcL.js";import{e as y}from"./routes-Dqa4L_BV.js";import{s as w}from"./StarredEntitiesApi-B9nCKC42.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-arzc73Pi.js";import"./useIsomorphicLayoutEffect-CzIfcLC5.js";import"./useAnalytics--K1VOgoc.js";import"./useAsync-D8arkYRP.js";import"./useMountedState-Cru6FRlT.js";import"./componentData-CnWfJ3h2.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-B-o6asHV.js";import"./useApp-y9Jc7IOk.js";import"./index-BTMjwqrs.js";import"./Plugin-IDIj0Vlw.js";import"./useRouteRef-HPBHqWqn.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-CSbact9R.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-C6fVNRgG.js";import"./Grid-v0xxfd_1.js";import"./Box-a1543Axe.js";import"./styled-DNUHEHW0.js";import"./TextField-l0kv8J66.js";import"./Select-C_CXebeo.js";import"./index-DnL3XN75.js";import"./Popover-C0oEerqE.js";import"./Modal-Bq63ThXv.js";import"./Portal-JPlxc26l.js";import"./List-BRXiU0XK.js";import"./ListContext-BOYwBhLf.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CmTUajr5.js";import"./FormLabel-BzcOsTWE.js";import"./InputLabel-BiLRbSYU.js";import"./ListItem-Cb_9Twd1.js";import"./ListItemIcon-BVOcAzHN.js";import"./ListItemText-BWf0pAiq.js";import"./Remove-UUafP89W.js";import"./useCopyToClipboard-CdfTyMvr.js";import"./Button-CYNcmEzy.js";import"./Divider-CU5IM_SK.js";import"./FormControlLabel-UgIf5aCO.js";import"./Checkbox-EhXMUHs5.js";import"./SwitchBase-DJM2Sst8.js";import"./RadioGroup-BgFF9HKn.js";import"./MenuItem-lTxBVbJM.js";import"./translation-gDLjdSFh.js";import"./DialogTitle-N20emC9L.js";import"./Backdrop-CvNyeuNu.js";import"./Tooltip-BSjhen_5.js";import"./Popper-BlfRkzWo.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BmL_Luoo.js";import"./Edit-DkE4_6bq.js";import"./Cancel-D6BRXFeP.js";import"./Progress-hBrdaONs.js";import"./LinearProgress-B_UID65b.js";import"./ContentHeader-8Opgqu-9.js";import"./Helmet-Cnl8G7sc.js";import"./ErrorBoundary-BzulBN0z.js";import"./ErrorPanel-EUwm2tRb.js";import"./WarningPanel-f4sgKJ3Y.js";import"./ExpandMore-C2bx2cGu.js";import"./AccordionDetails-DTv3HEFi.js";import"./Collapse-BxjtCAeZ.js";import"./MarkdownContent-Dh73zjai.js";import"./CodeSnippet-C8zNOjQI.js";import"./CopyTextButton-CW3FaXzD.js";import"./LinkButton-C9QcjCSf.js";import"./Link-Cz9gaJJo.js";import"./useElementFilter-DMyKSC74.js";import"./InfoCard-DPJdH_Et.js";import"./CardContent-Bf4mW7o7.js";import"./CardHeader-CjUFrut6.js";import"./CardActions-ClCDbtfI.js";import"./BottomLink-Ds2ntytz.js";import"./ArrowForward-JohorMon.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  // This is the default configuration that is shown to the user
  // when first arriving to the homepage.
  const defaultConfig = [{
    component: 'HomePageSearchBar',
    x: 0,
    y: 0,
    width: 12,
    height: 5
  }, {
    component: 'HomePageRandomJoke',
    x: 0,
    y: 2,
    width: 6,
    height: 16
  }, {
    component: 'HomePageStarredEntities',
    x: 6,
    y: 2,
    width: 6,
    height: 12
  }];
  return <CustomHomepageGrid config={defaultConfig} rowHeight={10}>
      // Insert the allowed widgets inside the grid. User can add, organize and
      // remove the widgets as they want.
      <HomePageSearchBar />
      <HomePageRandomJoke />
      <HomePageStarredEntities />
    </CustomHomepageGrid>;
}`,...e.parameters?.docs?.source}}};const ae=["CustomizableTemplate"];export{e as CustomizableTemplate,ae as __namedExportsOrder,me as default};
