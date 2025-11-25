import{j as t,T as i,c as m,C as a}from"./iframe-DVllq_JJ.js";import{w as n}from"./appWrappers-C9euYDcG.js";import{s as p,H as s}from"./plugin-B7hHNspn.js";import{c as d}from"./api-DzHDZ1RB.js";import{c}from"./catalogApiMock-DLCrqV4a.js";import{M as g}from"./MockStarredEntitiesApi-DaRlCfK-.js";import{s as l}from"./api-CuPwg010.js";import{C as h}from"./CustomHomepageGrid-Di6aTS_m.js";import{H as f,a as u}from"./plugin-D3vE2yAH.js";import{e as y}from"./routes-Dr5G0htj.js";import{s as w}from"./StarredEntitiesApi-ByyHUoK5.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-cKfOObA8.js";import"./useIsomorphicLayoutEffect-DMTlV3dY.js";import"./useAnalytics-gDAqv4j8.js";import"./useAsync-2B4YlYUd.js";import"./useMountedState-CAQUPkod.js";import"./componentData-ir7sX7tS.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-CuC9x3hw.js";import"./useApp-CkFK6AHh.js";import"./index-D1624cHW.js";import"./Plugin-DZCzK3PC.js";import"./useRouteRef-Dq-yTMyo.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-qbxc8ega.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-CvqXIiNq.js";import"./Grid-GLf92srY.js";import"./Box-DvszX2T2.js";import"./styled-DfELtcUs.js";import"./TextField-Dey_iDV3.js";import"./Select-C2FbmBaB.js";import"./index-DnL3XN75.js";import"./Popover-BN4BKHON.js";import"./Modal-Iqgu4vP7.js";import"./Portal-BdFeljN4.js";import"./List-B5MAQ6Y4.js";import"./ListContext-DE_PmqSG.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-FUAgoXnH.js";import"./FormLabel-BUcwKNSV.js";import"./InputLabel-Bw5HT09J.js";import"./ListItem-DLfoHZ9h.js";import"./ListItemIcon-YeiYafbr.js";import"./ListItemText-C9klhbSR.js";import"./Remove-BFl7hMaa.js";import"./useCopyToClipboard-DQH_xRRB.js";import"./Button-CqkFteVA.js";import"./Divider-CjoboeOw.js";import"./FormControlLabel-D_UvSrP6.js";import"./Checkbox-C4IbqV4-.js";import"./SwitchBase-Ch36SCvN.js";import"./RadioGroup-DzSyM_xi.js";import"./MenuItem-Dt6qEJa5.js";import"./translation-DmOjr45R.js";import"./DialogTitle-tzRl7hzM.js";import"./Backdrop-bmyTmjrQ.js";import"./Tooltip-CArIk1uN.js";import"./Popper-Bc5fPVw6.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-DMFkXH8p.js";import"./Edit-DHaGKzd9.js";import"./Cancel-BxG2yqKc.js";import"./Progress-DB4UOi34.js";import"./LinearProgress-CF1c1hdt.js";import"./ContentHeader-DggXLWsP.js";import"./Helmet-CSWI4zkb.js";import"./ErrorBoundary-BL32Oe-y.js";import"./ErrorPanel-Yv09NjH-.js";import"./WarningPanel-CTVbrDnl.js";import"./ExpandMore-DeLbxlk1.js";import"./AccordionDetails-Df6QxQno.js";import"./Collapse-BPkQPj1V.js";import"./MarkdownContent-C4WJ4LoY.js";import"./CodeSnippet-pYWcNvfR.js";import"./CopyTextButton-DyV_pNjJ.js";import"./LinkButton-CyMvoAXZ.js";import"./Link-Dfj65VZ1.js";import"./useElementFilter-T0HMKVXR.js";import"./InfoCard-CHyQV-0n.js";import"./CardContent-BJRiL5GO.js";import"./CardHeader-9ttq-nyk.js";import"./CardActions-CigbsVLY.js";import"./BottomLink-C3Knj5tN.js";import"./ArrowForward-_2sqR9gC.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
