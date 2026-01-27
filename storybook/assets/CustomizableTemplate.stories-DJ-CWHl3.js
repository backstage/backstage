import{j as t,T as i,c as m,C as a}from"./iframe-C1ohgxPY.js";import{w as n}from"./appWrappers-53W6Z_Fl.js";import{s as p,H as s}from"./plugin-B4yYs9OM.js";import{c as d}from"./api-BJtof8kJ.js";import{c}from"./catalogApiMock-DSy7moMJ.js";import{M as g}from"./MockStarredEntitiesApi-CbF4zgjd.js";import{s as l}from"./api-CE51VUC6.js";import{C as h}from"./CustomHomepageGrid-omsdcsWu.js";import{H as f,a as u}from"./plugin-DEyj1dW0.js";import{e as y}from"./routes-BJobwmGa.js";import{s as w}from"./StarredEntitiesApi-DI0UcRXu.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-CezIJmdx.js";import"./useIsomorphicLayoutEffect-C8m3vn51.js";import"./useAnalytics-CjWTFi6W.js";import"./useAsync-TxDBlLIm.js";import"./useMountedState-m4mlNTW7.js";import"./componentData-CLq0rdgK.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-pzwzu_48.js";import"./useApp-J6Z3sWBa.js";import"./index-Y7FEkxuw.js";import"./Plugin-cKXSvaFH.js";import"./useRouteRef-ayjdeWHT.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./Add-8syoRKMn.js";import"./Grid-ClUEh4fm.js";import"./Box-B9XEklXr.js";import"./styled-DiQntVKI.js";import"./TextField-qusgp1qc.js";import"./Select-BFRMPf_R.js";import"./index-B9sM2jn7.js";import"./Popover-dG1DuDKo.js";import"./Modal-EWqQvSRV.js";import"./Portal-CA7fRi5Y.js";import"./List-BRbAiMJU.js";import"./ListContext-Ds-TBdUQ.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B1t4u1fs.js";import"./FormLabel-ggneQAeG.js";import"./InputLabel-DMGCvr47.js";import"./ListItem-Ck2-kEA7.js";import"./ListItemIcon-aCYfAd64.js";import"./ListItemText-Bu4Q5VY7.js";import"./Remove-Bv85tdop.js";import"./useCopyToClipboard-ByZDolH4.js";import"./Button-aR7p6seP.js";import"./Divider-D8U2y_Q5.js";import"./FormControlLabel-CIhXpm37.js";import"./Checkbox-C7mjLyTp.js";import"./SwitchBase-D3YfGPbY.js";import"./RadioGroup-C5dRc01A.js";import"./MenuItem-ZRdlH76G.js";import"./translation-Dk0KVytF.js";import"./DialogTitle-DrsqXQow.js";import"./Backdrop-D03isVae.js";import"./Tooltip-Dpj1LhZh.js";import"./Popper-BcbGe3J0.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-B9kNS-9S.js";import"./Edit-C_d37u2G.js";import"./Cancel-CI9TtvhQ.js";import"./Progress-DbBnU1W6.js";import"./LinearProgress-BJyE22FH.js";import"./ContentHeader-DOF6bLH5.js";import"./Helmet-CwPqQe4j.js";import"./ErrorBoundary-DUAUzTN6.js";import"./ErrorPanel-Cu206NQf.js";import"./WarningPanel-Cqk4HdYp.js";import"./ExpandMore-BahcoyIm.js";import"./AccordionDetails-Ci8EIrXK.js";import"./Collapse-BVJkjsmV.js";import"./MarkdownContent-CG5N0PWp.js";import"./CodeSnippet-CdNwSyzj.js";import"./CopyTextButton-Cqy0wuG-.js";import"./LinkButton-C8n9_7UA.js";import"./Link-DLDptLAM.js";import"./useElementFilter-B8IOm0sy.js";import"./InfoCard-BI6fiYg-.js";import"./CardContent-QS0yr0Ka.js";import"./CardHeader-B400OvSW.js";import"./CardActions-B2UPjdQO.js";import"./BottomLink-Bwy_Zoku.js";import"./ArrowForward-DrZLn-s7.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
