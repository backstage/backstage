import{j as t,T as i,c as m,C as a}from"./iframe-D7tLk4ld.js";import{w as n}from"./appWrappers-LFN562Aq.js";import{s as p,H as s}from"./plugin-CJeyItKq.js";import{c as d}from"./api-Bm66sEzD.js";import{c}from"./catalogApiMock-CJwiFQvT.js";import{M as g}from"./MockStarredEntitiesApi-D8GvFdyB.js";import{s as l}from"./api-BUdgNFzo.js";import{C as h}from"./CustomHomepageGrid-B2Famw9w.js";import{H as f,a as u}from"./plugin-D0BFLUdw.js";import{e as y}from"./routes-CeeecDbd.js";import{s as w}from"./StarredEntitiesApi-B7CWv2xi.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-D9uYqvSU.js";import"./useIsomorphicLayoutEffect-B8c2dJoh.js";import"./useAnalytics-CQ9fO8VZ.js";import"./useAsync-PQB885ej.js";import"./useMountedState-CdD92umV.js";import"./componentData-Dqkdwtuq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-aaT1AT_u.js";import"./useApp-D_E3IHJo.js";import"./index-BndmOlo_.js";import"./Plugin-B7Cc_-YL.js";import"./useRouteRef-BfGdJ_eX.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./Add-C_PnmJat.js";import"./Grid-DIKn7D0E.js";import"./Box-BQ6FCTAV.js";import"./styled-C4zBw5eq.js";import"./TextField-B0GEB87Y.js";import"./Select-DyhOzteH.js";import"./index-B9sM2jn7.js";import"./Popover-9B-RCRNY.js";import"./Modal-DgNAzS_W.js";import"./Portal-BczuNMGa.js";import"./List-By8TLyAJ.js";import"./ListContext-2_-4hUG0.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-bXlwkDCf.js";import"./FormLabel-C6eEetQj.js";import"./InputLabel-B-pXPnI8.js";import"./ListItem-bVDpz6Z-.js";import"./ListItemIcon-0fesE0Jk.js";import"./ListItemText-DUrf7V-S.js";import"./Remove-CmuZhbPl.js";import"./useCopyToClipboard-DDHvggmk.js";import"./Button-z5kV09UR.js";import"./Divider-Dcp5X0Oe.js";import"./FormControlLabel-C0i3nhot.js";import"./Checkbox-CEVJYrEW.js";import"./SwitchBase-CdBgof0M.js";import"./RadioGroup-BBDwYQLG.js";import"./MenuItem-I4MCUMJg.js";import"./translation-OhiwGtuf.js";import"./DialogTitle-D56g35nD.js";import"./Backdrop-Cyu771p_.js";import"./Tooltip-CJcYpKaL.js";import"./Popper-B109mB6A.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-D_LE2Szm.js";import"./Edit-CB6S2hdV.js";import"./Cancel-CsR_qoH8.js";import"./Progress-BQMBbkUc.js";import"./LinearProgress-BizOxAN6.js";import"./ContentHeader-Ds1h1bwX.js";import"./Helmet-BheNeVw7.js";import"./ErrorBoundary-DBuFbPsZ.js";import"./ErrorPanel-CjfyCBSQ.js";import"./WarningPanel-waa_5WFz.js";import"./ExpandMore-Br1SomQR.js";import"./AccordionDetails-xzn6Vz4b.js";import"./Collapse-CJcP5srX.js";import"./MarkdownContent-DEtoV9Sg.js";import"./CodeSnippet-i4EOu1Cg.js";import"./CopyTextButton-D-7TENHT.js";import"./LinkButton-rPQfynvr.js";import"./Link-B-Kks6_R.js";import"./useElementFilter-CO5L2oex.js";import"./InfoCard-v3VrqR1c.js";import"./CardContent-Ckitt63X.js";import"./CardHeader-wKEMhpg-.js";import"./CardActions-Bk3RRZ7t.js";import"./BottomLink-CYGivY5K.js";import"./ArrowForward-C-Ay2WeA.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
