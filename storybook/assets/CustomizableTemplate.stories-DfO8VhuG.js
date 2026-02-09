import{j as t,U as i,V as m,W as a}from"./iframe-CZ56O-V9.js";import{s as n,H as p}from"./plugin-BUPH-RXF.js";import{c as s}from"./api-D5xBhMlD.js";import{c as d}from"./catalogApiMock-BJGuRpZz.js";import{M as c}from"./MockStarredEntitiesApi-DbYXJT6X.js";import{s as g}from"./api-C0b41NLl.js";import{C as l}from"./CustomHomepageGrid-LVuZ4OlZ.js";import{H as h,a as f}from"./plugin-D7PDWxiM.js";import{e as u}from"./routes-DCIpPh8u.js";import{w as y}from"./appWrappers-BeJ0xyiP.js";import{s as w}from"./StarredEntitiesApi-DE9_rC4H.js";import"./preload-helper-PPVm8Dsz.js";import"./index-EaCOp69p.js";import"./Plugin-DZUy8-Yb.js";import"./componentData-CSZ8ujY9.js";import"./useAnalytics-BS680IS8.js";import"./useApp-BeYLp8SO.js";import"./useRouteRef-CcFxojYp.js";import"./index-Ca3h4iDJ.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useObservable-ByqNzwSP.js";import"./useIsomorphicLayoutEffect-D3HbnLj9.js";import"./isObject--vsEa_js.js";import"./isSymbol-DYihM2bc.js";import"./toString-jlmj72dF.js";import"./Add-gfdccgZ5.js";import"./Grid-DjbHNKXL.js";import"./Box-MN-uZs4I.js";import"./styled-D9whByUF.js";import"./TextField-DH-_gpSM.js";import"./Select-CvcKmOJe.js";import"./index-B9sM2jn7.js";import"./Popover-hzCM8euj.js";import"./Modal-CQLQBAd-.js";import"./Portal-rgcloK6u.js";import"./List-DEdaJe5c.js";import"./ListContext-BmrJCIpO.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DbdKJwgf.js";import"./FormLabel-BAfE8vI7.js";import"./InputLabel-BKt55Sxd.js";import"./ListItem-BtvfynNb.js";import"./ListItemIcon-B1QkhF77.js";import"./ListItemText-Dn38yijY.js";import"./Remove-DkfqhML0.js";import"./useCopyToClipboard-CrTqHNaz.js";import"./useMountedState-ut5gwY4t.js";import"./Button-DKgYvdYh.js";import"./Divider-C407Z4rN.js";import"./FormControlLabel-CpxyeQKn.js";import"./Checkbox-CcaK8VHq.js";import"./SwitchBase-DAeiXm-p.js";import"./RadioGroup-BgFrbLYE.js";import"./MenuItem-0ISkGz6r.js";import"./translation-Dp_7bUUA.js";import"./DialogTitle-C-1j8eOs.js";import"./Backdrop-DdZZM_yb.js";import"./Tooltip-B8FLw8lE.js";import"./Popper-7tudyaaz.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-D2XJvOlP.js";import"./Edit-d2ZXzPHv.js";import"./Cancel-HZRT61B5.js";import"./Progress-Du9yI75y.js";import"./LinearProgress-DvsI2E8u.js";import"./ContentHeader-1pE7QyfV.js";import"./Helmet-B72-K-tM.js";import"./ErrorBoundary-bCgK2ux4.js";import"./ErrorPanel-CQnJnEL8.js";import"./WarningPanel-CChAptH0.js";import"./ExpandMore-yvURIOcL.js";import"./AccordionDetails-BaPE-Me3.js";import"./Collapse-DPNvm9kr.js";import"./MarkdownContent-BOJKT2W9.js";import"./CodeSnippet-rkZMP_wC.js";import"./CopyTextButton-wUac2sWa.js";import"./LinkButton-Bp2XTFR0.js";import"./Link-BQF_zimC.js";import"./useElementFilter-DsgRz-ny.js";import"./InfoCard-BF5bOwh8.js";import"./CardContent-DTAML6Xx.js";import"./CardHeader-BN2Aoi7y.js";import"./CardActions-PhczM4sT.js";import"./BottomLink-B_bxfdsL.js";import"./ArrowForward-CzbSCcaK.js";import"./useAsync-BZsMG4pg.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=d({entities:x}),o=new c;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>y(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[s,k],[w,o],[g,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":n.routes.root,"/catalog/:namespace/:kind/:name":u}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(l,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(p,{}),t.jsx(h,{}),t.jsx(f,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
