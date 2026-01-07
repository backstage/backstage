import{j as t,T as i,c as m,C as a}from"./iframe-BY6cr4Gs.js";import{w as n}from"./appWrappers-Pq-5KpLz.js";import{s as p,H as s}from"./plugin-DfBn9OsQ.js";import{c as d}from"./api-BkBhYlPQ.js";import{c}from"./catalogApiMock-C6IxRpD4.js";import{M as g}from"./MockStarredEntitiesApi-CwVrJCFg.js";import{s as l}from"./api-Bn_bwlkS.js";import{C as h}from"./CustomHomepageGrid-CNLdiAUN.js";import{H as f,a as u}from"./plugin-D9w6b_6Z.js";import{e as y}from"./routes-CcFiWGl-.js";import{s as w}from"./StarredEntitiesApi-DN2hreE0.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-BMg2j1pk.js";import"./useIsomorphicLayoutEffect-BEJqApFw.js";import"./useAnalytics-BgncGw0N.js";import"./useAsync-BOpzAa1K.js";import"./useMountedState-wBq7rhLl.js";import"./componentData-DkH1zoGD.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CidjncPb.js";import"./useApp-Tcb-kbrm.js";import"./index-B19kwgjz.js";import"./Plugin-1eY0U0Da.js";import"./useRouteRef-CBJLvC2e.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./Add-BzcL3Bqs.js";import"./Grid-CPNST6ei.js";import"./Box-CioLgZLe.js";import"./styled-C2PdKBXZ.js";import"./TextField-CzeKprQz.js";import"./Select-Dk4pHiCq.js";import"./index-B9sM2jn7.js";import"./Popover-CSLjBTLK.js";import"./Modal-27M29ymL.js";import"./Portal-RovY2swJ.js";import"./List-BYnFuPKk.js";import"./ListContext-Cv7Ut4-T.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CHRehZxK.js";import"./FormLabel-BzT2D_7Q.js";import"./InputLabel-C4V1mFuX.js";import"./ListItem-Bc4c47Te.js";import"./ListItemIcon-D_2DVl9p.js";import"./ListItemText-DmFJDJ0x.js";import"./Remove-CQGIxIrA.js";import"./useCopyToClipboard-Cl0_Rkec.js";import"./Button-BcV-aad6.js";import"./Divider-0kZVZRxa.js";import"./FormControlLabel-CrNQfLtK.js";import"./Checkbox-Op7BBwQy.js";import"./SwitchBase-DxbKBBck.js";import"./RadioGroup-D4cR2wOx.js";import"./MenuItem-D_E8OHlC.js";import"./translation-CFCSIc9Y.js";import"./DialogTitle-CbbvyQ_k.js";import"./Backdrop-BfxA9Fnq.js";import"./Tooltip-BeI5iaz3.js";import"./Popper-DBVT3TNi.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BQvpt6fw.js";import"./Edit-CqyZlfEP.js";import"./Cancel-cAc_rZ19.js";import"./Progress-DgqZSMMd.js";import"./LinearProgress-De55rnu5.js";import"./ContentHeader-BFx_F_zO.js";import"./Helmet-BJeiNuBD.js";import"./ErrorBoundary-hvzZq_Hc.js";import"./ErrorPanel-DAslEoWf.js";import"./WarningPanel-CSeK1Ani.js";import"./ExpandMore-3nEtbL-z.js";import"./AccordionDetails-B6u38Rkn.js";import"./Collapse-hpYL9C9B.js";import"./MarkdownContent-pb-oNpPa.js";import"./CodeSnippet-CfugQICb.js";import"./CopyTextButton-CGe-CNwz.js";import"./LinkButton-ByF38BEu.js";import"./Link-Y-vtcYZ5.js";import"./useElementFilter-CN7RVtxc.js";import"./InfoCard-BuJiqpT7.js";import"./CardContent-JC9uGNq1.js";import"./CardHeader-C1KSGg0j.js";import"./CardActions-wlHMcfv2.js";import"./BottomLink-4rbJl6ej.js";import"./ArrowForward-C-vHhjk_.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
