import{j as t,T as i,c as m,C as a}from"./iframe-DLxOzT4t.js";import{w as n}from"./appWrappers-BgZnm0lF.js";import{s as p,H as s}from"./plugin-6FpJEJVS.js";import{c as d}from"./api-7j1uRzms.js";import{c}from"./catalogApiMock-Xf_VhSk_.js";import{M as g}from"./MockStarredEntitiesApi-D5IIo2Tp.js";import{s as l}from"./api-DIB8lQ_j.js";import{C as h}from"./CustomHomepageGrid-BAEFqMh4.js";import{H as f,a as u}from"./plugin-D1Vsl5C_.js";import{e as y}from"./routes-DpNR4tak.js";import{s as w}from"./StarredEntitiesApi-BHNDUe5F.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-Bzw4Lu4i.js";import"./useAnalytics-iDMqp06i.js";import"./useAsync-CNKDNBbw.js";import"./useMountedState-DJ6mJaNE.js";import"./componentData-B5NpAqVg.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-YuKWWjwW.js";import"./useApp-CkqCNNj_.js";import"./index-DAIM8wYU.js";import"./Plugin-D7Oiw_QY.js";import"./useRouteRef-HPNEm24O.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-B2ozGJw_.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-CJcr0tIP.js";import"./Grid-DTcNMdF5.js";import"./Box-BEY2IraA.js";import"./styled-C22knZjm.js";import"./TextField-BTDPSMt-.js";import"./Select-CPCg6RTy.js";import"./index-DnL3XN75.js";import"./Popover-D3O0AVPe.js";import"./Modal-7EqbtETg.js";import"./Portal-CdFb3as0.js";import"./List-D0oVWlo0.js";import"./ListContext-CoRXql5V.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C7IDKwBs.js";import"./FormLabel-CIWGjYLB.js";import"./InputLabel-_L_-Ra5C.js";import"./ListItem-C0vbBd3c.js";import"./ListItemIcon-DKDR-JNb.js";import"./ListItemText-DNlkMNGC.js";import"./Remove-Bhv2zdDL.js";import"./useCopyToClipboard-C72jLjo9.js";import"./Button-DWoU60bY.js";import"./Divider-CWCd2akK.js";import"./FormControlLabel-DtzjeF7-.js";import"./Checkbox-B4IBeA4V.js";import"./SwitchBase-DpNghUdM.js";import"./RadioGroup-CcOHnV04.js";import"./MenuItem-HEJX_7yi.js";import"./translation-n3MUx6cF.js";import"./DialogTitle-Dn15pT6I.js";import"./Backdrop-D5lzsJdl.js";import"./Tooltip-CfLuXrUC.js";import"./Popper-DRx4nqXa.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-CbGXKdcF.js";import"./Edit-CzPHBmWw.js";import"./Cancel-BOnIt5-b.js";import"./Progress-CNQyHm_P.js";import"./LinearProgress-BfP3PMsz.js";import"./ContentHeader-CUoTwkgN.js";import"./Helmet-RrVWyDd3.js";import"./ErrorBoundary-KnBb7wcL.js";import"./ErrorPanel-RMUJvBFr.js";import"./WarningPanel-Dc2tcH1q.js";import"./ExpandMore-K2fwTw0G.js";import"./AccordionDetails-DoLgEhQ2.js";import"./Collapse-Dx6BQFCw.js";import"./MarkdownContent-C4aBi8UG.js";import"./CodeSnippet-Drl8Y1S9.js";import"./CopyTextButton-B07LVSwl.js";import"./LinkButton-BJUAlKHF.js";import"./Link-CRIj9jSl.js";import"./useElementFilter-C6BrAlZY.js";import"./InfoCard-BX_nQnVA.js";import"./CardContent-Bj7b70Os.js";import"./CardHeader-DKM6gr3f.js";import"./CardActions-C6azI5IY.js";import"./BottomLink-BLtQezSR.js";import"./ArrowForward-BRfxW2ea.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ie={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};const me=["CustomizableTemplate"];export{e as CustomizableTemplate,me as __namedExportsOrder,ie as default};
