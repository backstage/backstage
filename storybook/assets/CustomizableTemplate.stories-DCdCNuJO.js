import{j as t,T as i,c as m,C as a}from"./iframe-Hw755TNi.js";import{w as n}from"./appWrappers-D03uvxZe.js";import{s as p,H as s}from"./plugin-9mq8IABY.js";import{c as d}from"./api-BR9ls_JI.js";import{c}from"./catalogApiMock-DTmhu5ka.js";import{M as g}from"./MockStarredEntitiesApi-Be-e-iqz.js";import{s as l}from"./api-BlXSYa10.js";import{C as h}from"./CustomHomepageGrid-DyReV6wt.js";import{H as f,a as u}from"./plugin-BL2Fs7YY.js";import{e as y}from"./routes-Dy7Yjwmj.js";import{s as w}from"./StarredEntitiesApi-CnE2GfmM.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-Bntv1Tee.js";import"./useIsomorphicLayoutEffect-VemboVK5.js";import"./useAnalytics-CLuGYyUh.js";import"./useAsync-DhB8gEfG.js";import"./useMountedState-DdJ7HSpX.js";import"./componentData-BOwbR1Jz.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CMiNgydu.js";import"./useApp-DdUuBagy.js";import"./index-8CFES-Rb.js";import"./Plugin-BMqfvgOd.js";import"./useRouteRef-BmYWNidK.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./Add-MKT-vpc_.js";import"./Grid-w98sXAXk.js";import"./Box-DcpjYi3J.js";import"./styled-qTtGNmm_.js";import"./TextField-D0Q5AYGT.js";import"./Select-DNnS_kNb.js";import"./index-B9sM2jn7.js";import"./Popover-BfMi8ZLM.js";import"./Modal-DYeoU8Cn.js";import"./Portal-BZ6RZj06.js";import"./List-Z-bLSsG8.js";import"./ListContext-moCHcqFh.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CreWTCig.js";import"./FormLabel-CCu-keZU.js";import"./InputLabel-GF3KXnMY.js";import"./ListItem-DwV3XkH8.js";import"./ListItemIcon-tBZ4Y2eF.js";import"./ListItemText-f-UryDTW.js";import"./Remove-6GM3AVVM.js";import"./useCopyToClipboard-DQJZpUYG.js";import"./Button-CpMmzG9U.js";import"./Divider-BkC6drLy.js";import"./FormControlLabel-DwnK2onQ.js";import"./Checkbox-DlGWn6a6.js";import"./SwitchBase-4DCRLRcH.js";import"./RadioGroup-COpuKaU_.js";import"./MenuItem-DoJncjoe.js";import"./translation-ASTYtwcI.js";import"./DialogTitle-DJbOyMxK.js";import"./Backdrop-0thaD7uc.js";import"./Tooltip-BwBST4sz.js";import"./Popper-QpCwrVnW.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-Toxqf0-K.js";import"./Edit-BiTrTiWB.js";import"./Cancel-DYdHkl6Q.js";import"./Progress-3DFxdfJJ.js";import"./LinearProgress-CUr5wi2o.js";import"./ContentHeader-ClwHCJLm.js";import"./Helmet-BlnHPt8L.js";import"./ErrorBoundary-C546sKxy.js";import"./ErrorPanel-CQgjrtaw.js";import"./WarningPanel-BGdCoFxI.js";import"./ExpandMore-CG9kYvvb.js";import"./AccordionDetails-6Uenh_Cj.js";import"./Collapse-Cpllhes9.js";import"./MarkdownContent-C43gFO83.js";import"./CodeSnippet-8GoXIwx4.js";import"./CopyTextButton-8-jfuG_8.js";import"./LinkButton-CXrJu3G0.js";import"./Link-BYu3CTsd.js";import"./useElementFilter-B1zXfYdI.js";import"./InfoCard-kqX3XXCw.js";import"./CardContent-CYUX33L8.js";import"./CardHeader-DYcL2J26.js";import"./CardActions-_4wK1Jvd.js";import"./BottomLink-D76zrCEq.js";import"./ArrowForward-BgApEUXb.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};const oe=["CustomizableTemplate"];export{e as CustomizableTemplate,oe as __namedExportsOrder,ee as default};
