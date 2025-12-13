import{j as t,T as i,c as m,C as a}from"./iframe-DDGN0cGv.js";import{w as n}from"./appWrappers-C8vp-7ey.js";import{s as p,H as s}from"./plugin-DcGVZ5m9.js";import{c as d}from"./api-C5dqoa3s.js";import{c}from"./catalogApiMock-C7EdQie4.js";import{M as g}from"./MockStarredEntitiesApi-BdsTkwyv.js";import{s as l}from"./api-QlE9xgJi.js";import{C as h}from"./CustomHomepageGrid-BzH4qUFz.js";import{H as f,a as u}from"./plugin-DVGBlnIw.js";import{e as y}from"./routes-DFoOfbNi.js";import{s as w}from"./StarredEntitiesApi-DlgLMFKZ.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-DAxbAlyD.js";import"./useIsomorphicLayoutEffect-B9TlIMZW.js";import"./useAnalytics-CyvQxdhU.js";import"./useAsync-2V8xCCu6.js";import"./useMountedState-DWcF_6cb.js";import"./componentData-lXmOowuG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-DCDfH_Li.js";import"./useApp-CWuHwuj4.js";import"./index-C9NKfyH6.js";import"./Plugin-CBvsz8vm.js";import"./useRouteRef-6TTRl5Mq.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./Add-CpjAa7q7.js";import"./Grid-D5cwdvdp.js";import"./Box-Ddxf02Aa.js";import"./styled-BpU391Me.js";import"./TextField-CfRq2jh9.js";import"./Select-C5MBmxAB.js";import"./index-B9sM2jn7.js";import"./Popover-BIEPvO5s.js";import"./Modal-y_bxeVJ1.js";import"./Portal-BqHzn-UB.js";import"./List-B6XxVgNa.js";import"./ListContext-BfPeZX-c.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BrQ4BsJz.js";import"./FormLabel-Cvs8umqz.js";import"./InputLabel-xEVhEFxf.js";import"./ListItem-B4p-bJZY.js";import"./ListItemIcon-DzLg1Qai.js";import"./ListItemText-D6aBcig9.js";import"./Remove-_axB_AZo.js";import"./useCopyToClipboard-BVpL61aI.js";import"./Button-BfPTYQOm.js";import"./Divider-nJoj97pl.js";import"./FormControlLabel-XhrOrDgB.js";import"./Checkbox-B2s7QLiP.js";import"./SwitchBase-BKApDkHi.js";import"./RadioGroup-mTA0sAsL.js";import"./MenuItem-DotvnHD1.js";import"./translation-CW6-D57O.js";import"./DialogTitle-CZfoj8Tu.js";import"./Backdrop-0jy0HFas.js";import"./Tooltip-DRtRsFO2.js";import"./Popper-LrvUQOcS.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-dF5pGzeD.js";import"./Edit-DaSdVs8z.js";import"./Cancel-CmdLpz5V.js";import"./Progress-2vcWT6H-.js";import"./LinearProgress-BqbJleYC.js";import"./ContentHeader-BBRdCauF.js";import"./Helmet-B1PfSIwb.js";import"./ErrorBoundary-LiF7Clop.js";import"./ErrorPanel-sm5fOIxM.js";import"./WarningPanel-BvxUrI8I.js";import"./ExpandMore-DdbG_Iny.js";import"./AccordionDetails-D8hpySZx.js";import"./Collapse-1BtLbcFp.js";import"./MarkdownContent-D_mSSllG.js";import"./CodeSnippet-DUu5zKgy.js";import"./CopyTextButton-K6z11-1u.js";import"./LinkButton-Dund-JVG.js";import"./Link-UwAe9NOh.js";import"./useElementFilter-CNq4VEjT.js";import"./InfoCard-_Sz2aZkG.js";import"./CardContent-D6aqZ2EH.js";import"./CardHeader-tCD53RXU.js";import"./CardActions-CHc_Iyiq.js";import"./BottomLink-DHFnJkTT.js";import"./ArrowForward-KHx9CCNT.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
