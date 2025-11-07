import{j as t,T as i,c as m,C as a}from"./iframe-DqJQ9uPs.js";import{w as n}from"./appWrappers-DvUcS6kA.js";import{s as p,H as s}from"./plugin-GjKQLFY4.js";import{c as d}from"./api-DrvDFWyv.js";import{c}from"./catalogApiMock-DslU3kGG.js";import{M as g}from"./MockStarredEntitiesApi-CzD4is9g.js";import{s as l}from"./api-DFeRnRBI.js";import{C as h}from"./CustomHomepageGrid-CFHGM1iv.js";import{H as f,a as u}from"./plugin-BWMFMYkc.js";import{e as y}from"./routes-CAwiEPb-.js";import{s as w}from"./StarredEntitiesApi-DFSkVDxF.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-CXAnoMNy.js";import"./useIsomorphicLayoutEffect-C4uh4-7_.js";import"./useAnalytics-CfDtSbQu.js";import"./useAsync-DlfksqDa.js";import"./useMountedState-BU_XpB7e.js";import"./componentData-9JsUC9W5.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-DalzLXVm.js";import"./useApp-ByL28iDl.js";import"./index-IonfJZQ1.js";import"./Plugin-DUvFkCSb.js";import"./useRouteRef-DZAPdgx2.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-BnFo44sc.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-Duvn-Rjm.js";import"./Grid-KKLALRV6.js";import"./Box-7v7Ku6kY.js";import"./styled-DV7YmZBO.js";import"./TextField-DaWEjdom.js";import"./Select-BTs0VRvv.js";import"./index-DnL3XN75.js";import"./Popover-O0XQDvdf.js";import"./Modal-DbdYSBMO.js";import"./Portal-CAVLkONX.js";import"./List-HqDhN-yv.js";import"./ListContext-DWNGGGl9.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CUP8RVYe.js";import"./FormLabel-CFDsgmCA.js";import"./InputLabel-DI2qx3ui.js";import"./ListItem-DIBtNilh.js";import"./ListItemIcon-DddJgjrL.js";import"./ListItemText-QaJAw11k.js";import"./Remove-Ch-DBY0W.js";import"./useCopyToClipboard-DMYhOdjt.js";import"./Button-D9LFAX2g.js";import"./Divider-xOTMBAcj.js";import"./FormControlLabel-5NbKKGu3.js";import"./Checkbox-CMX1Hq5y.js";import"./SwitchBase-dvRTwFBi.js";import"./RadioGroup-RnCZKVBt.js";import"./MenuItem-CVc4UX_G.js";import"./translation-Ea136ofV.js";import"./DialogTitle-DiqXRAVM.js";import"./Backdrop-lmkQ576F.js";import"./Tooltip-6CCJUAWE.js";import"./Popper-DOaVy74A.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-CCOwbKG6.js";import"./Edit-j7PTvP2b.js";import"./Cancel-DRwaPjQQ.js";import"./Progress-Cytqjl3n.js";import"./LinearProgress-C_iy2IoU.js";import"./ContentHeader-CpcnHTSg.js";import"./Helmet-yMOzAhtb.js";import"./ErrorBoundary-CCN1fcMR.js";import"./ErrorPanel-BTFsykmd.js";import"./WarningPanel-DWxbAFrU.js";import"./ExpandMore-BotAWQ1n.js";import"./AccordionDetails-Dyf75Eaf.js";import"./Collapse-BECsH0M_.js";import"./MarkdownContent-DTBwyM42.js";import"./CodeSnippet-BQDzaUOg.js";import"./CopyTextButton-Y9iCOjyT.js";import"./LinkButton-CscTtu-Y.js";import"./Link-ClrQx1QP.js";import"./useElementFilter-CJngIIsu.js";import"./InfoCard-DfVmKB2_.js";import"./CardContent-C-XbivhQ.js";import"./CardHeader-C2FhjhCg.js";import"./CardActions-DVY4viYA.js";import"./BottomLink-v4r4qDIO.js";import"./ArrowForward-DPFWrTp5.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
