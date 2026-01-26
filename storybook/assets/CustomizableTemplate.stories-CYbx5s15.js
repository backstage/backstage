import{j as t,T as i,c as m,C as a}from"./iframe-CG856I7g.js";import{w as n}from"./appWrappers-DEP7SCZP.js";import{s as p,H as s}from"./plugin-BUxNYUaJ.js";import{c as d}from"./api-b1JXKp8N.js";import{c}from"./catalogApiMock-DhaMkQZj.js";import{M as g}from"./MockStarredEntitiesApi-C55Z641Z.js";import{s as l}from"./api-B_0Mfj8s.js";import{C as h}from"./CustomHomepageGrid-BdfP5l2J.js";import{H as f,a as u}from"./plugin-BqJnaI0I.js";import{e as y}from"./routes-C4A-lDPp.js";import{s as w}from"./StarredEntitiesApi-DKuuq7b0.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-CZ-R5m23.js";import"./useIsomorphicLayoutEffect-BmiTUf2k.js";import"./useAnalytics-D5P-YjA8.js";import"./useAsync-CdIFnDD6.js";import"./useMountedState-Bvsb1ptg.js";import"./componentData-aFf6ewzF.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-PWNHdhKk.js";import"./useApp-CtCgKAFa.js";import"./index-BbWamktc.js";import"./Plugin-D3BXoFcT.js";import"./useRouteRef-B8PYaAAi.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./Add-Bgo4nt0j.js";import"./Grid-CG84KQIV.js";import"./Box-DirFOCIJ.js";import"./styled-8AOit3ty.js";import"./TextField-Bp5eKkbH.js";import"./Select-BumcGofS.js";import"./index-B9sM2jn7.js";import"./Popover-BVt04z7T.js";import"./Modal-odp3IgY3.js";import"./Portal-Bhu3uB1L.js";import"./List-BTwiC7G-.js";import"./ListContext-BzsI-cEV.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Ckxa1kyG.js";import"./FormLabel-9uCxckxd.js";import"./InputLabel-DA4-TPnU.js";import"./ListItem-BWUkcOJl.js";import"./ListItemIcon-DzmrMaMP.js";import"./ListItemText-QtFV-4wl.js";import"./Remove-DHA5FxCI.js";import"./useCopyToClipboard-CUxcez1F.js";import"./Button-os8mT4aD.js";import"./Divider-gH4LD_Ra.js";import"./FormControlLabel-BxAn_c0m.js";import"./Checkbox-lU_q1h3j.js";import"./SwitchBase-Dj8cS13X.js";import"./RadioGroup-BLG-tAdo.js";import"./MenuItem-DhNEnkRz.js";import"./translation-DQXcoNxk.js";import"./DialogTitle-BYAFwPKR.js";import"./Backdrop-DWQDC5UU.js";import"./Tooltip-DTkgI76M.js";import"./Popper-BTDu7j3q.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-DgiPi3S3.js";import"./Edit-CzpsaNUY.js";import"./Cancel-DWbQDfJV.js";import"./Progress-DD_RLr2_.js";import"./LinearProgress-GD2gmRBp.js";import"./ContentHeader-sepXzw6Z.js";import"./Helmet--qGJkA3K.js";import"./ErrorBoundary-BK2MlTdY.js";import"./ErrorPanel-DZ1ApYdQ.js";import"./WarningPanel-CDDj3MLB.js";import"./ExpandMore-DTKTum2k.js";import"./AccordionDetails-CmfQvp7G.js";import"./Collapse-vpACe9Y2.js";import"./MarkdownContent-BwSLPwTP.js";import"./CodeSnippet-CUezJ-Mg.js";import"./CopyTextButton-B_1HfWK0.js";import"./LinkButton-B6IB7a9D.js";import"./Link-Cd9n886D.js";import"./useElementFilter-BwvRComW.js";import"./InfoCard-DY4hdaxa.js";import"./CardContent-BwT5h854.js";import"./CardHeader-BjVEl-5E.js";import"./CardActions-CxPYtsdJ.js";import"./BottomLink-DB2Nr5nG.js";import"./ArrowForward-ClGRA-Ks.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
