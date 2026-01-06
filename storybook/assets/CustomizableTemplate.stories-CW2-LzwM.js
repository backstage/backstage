import{j as t,T as i,c as m,C as a}from"./iframe-DgkzaRcz.js";import{w as n}from"./appWrappers-BBkmPso_.js";import{s as p,H as s}from"./plugin-Cl9I96LN.js";import{c as d}from"./api-BqwTHubc.js";import{c}from"./catalogApiMock-C_YXjN6t.js";import{M as g}from"./MockStarredEntitiesApi-BSexnR-B.js";import{s as l}from"./api-BJ3-p9vs.js";import{C as h}from"./CustomHomepageGrid-DZY8xcVt.js";import{H as f,a as u}from"./plugin-KjjyD6lr.js";import{e as y}from"./routes-Cb5xYd94.js";import{s as w}from"./StarredEntitiesApi-B83Gzzxz.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-UgjFkqx9.js";import"./useIsomorphicLayoutEffect-PH24tZgE.js";import"./useAnalytics-qnTiS8hb.js";import"./useAsync-B6sI7pgh.js";import"./useMountedState-C4ChfPSk.js";import"./componentData-D6jwBdZo.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BovWTFKo.js";import"./useApp-Dd6zMmOH.js";import"./index-BH7N7lqx.js";import"./Plugin-Dd63G45J.js";import"./useRouteRef-CgaN9BS2.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./Add-Dv9DYIF4.js";import"./Grid-13HvIHxd.js";import"./Box-CjF3f9rs.js";import"./styled-TNDgSIeW.js";import"./TextField-D7Ulv7vB.js";import"./Select-BnN-ghVl.js";import"./index-B9sM2jn7.js";import"./Popover-BOhX_6l5.js";import"./Modal-BMl9YgIm.js";import"./Portal-DiyW3rHr.js";import"./List-UtDCRpiD.js";import"./ListContext-Bc5vGjYI.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Cha8QXy2.js";import"./FormLabel-Bz8mkRKR.js";import"./InputLabel-Hdp-talg.js";import"./ListItem-D-dCGJEh.js";import"./ListItemIcon-DgBckAZa.js";import"./ListItemText-BTjp8q3D.js";import"./Remove-Bji9w3EE.js";import"./useCopyToClipboard-CcmaW2E0.js";import"./Button-DputNV-f.js";import"./Divider-BsgTAdRC.js";import"./FormControlLabel-BL_4yP-I.js";import"./Checkbox-l1WyFc-8.js";import"./SwitchBase-TjDH3MPX.js";import"./RadioGroup-Dn0-bwQ6.js";import"./MenuItem-XzAP9_v_.js";import"./translation-DwMq0ctX.js";import"./DialogTitle-CLNs8i90.js";import"./Backdrop-Do9s46dm.js";import"./Tooltip-eP5YooZ3.js";import"./Popper-D8NH0TjN.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-Bx-FiS7-.js";import"./Edit-CUNI0v4g.js";import"./Cancel-BOQUAW6f.js";import"./Progress-DHKAo1e3.js";import"./LinearProgress-CH1xl8Ne.js";import"./ContentHeader-BtvU_FcK.js";import"./Helmet-t88x5hzm.js";import"./ErrorBoundary-BMyytlZG.js";import"./ErrorPanel-DxGQ0b0O.js";import"./WarningPanel-CQQNTNrV.js";import"./ExpandMore-Dxz0ockR.js";import"./AccordionDetails-FigVUmDd.js";import"./Collapse-zjOOSLQm.js";import"./MarkdownContent-B2WHC1-q.js";import"./CodeSnippet-qrWrlZ1D.js";import"./CopyTextButton-BPmF_Ha2.js";import"./LinkButton-Cj7uwqzc.js";import"./Link-CD76Rbm5.js";import"./useElementFilter-DR2X3iet.js";import"./InfoCard-DroCXsE2.js";import"./CardContent-BEcXzYfT.js";import"./CardHeader-BIR3esA0.js";import"./CardActions-VTkMzbqT.js";import"./BottomLink-DudYzn0u.js";import"./ArrowForward-Df-EQyM5.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
