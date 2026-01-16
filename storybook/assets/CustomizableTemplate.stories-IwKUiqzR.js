import{j as t,T as i,c as m,C as a}from"./iframe-XFwexWAC.js";import{w as n}from"./appWrappers-70i-hxtl.js";import{s as p,H as s}from"./plugin-Dwqv5ZOr.js";import{c as d}from"./api-BnhdUYgj.js";import{c}from"./catalogApiMock-CA0wMlID.js";import{M as g}from"./MockStarredEntitiesApi-5OD_0nb2.js";import{s as l}from"./api-BjMKO4Ip.js";import{C as h}from"./CustomHomepageGrid-CtD19skn.js";import{H as f,a as u}from"./plugin-DmfJPYc3.js";import{e as y}from"./routes-BtN93U7V.js";import{s as w}from"./StarredEntitiesApi-Y18Bq4Jy.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-BHUrIwGk.js";import"./useIsomorphicLayoutEffect-rnOglJxN.js";import"./useAnalytics-BpI3YstQ.js";import"./useAsync-CTNfJ6Gv.js";import"./useMountedState-D8mLU74K.js";import"./componentData-BgE2FK5U.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BjVSwF8u.js";import"./useApp-D2Je31QU.js";import"./index-DEcX1i1Z.js";import"./Plugin-DRnkdvxE.js";import"./useRouteRef-B_kQk1xP.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./Add-BbI5mEG5.js";import"./Grid-QGplJCTn.js";import"./Box-DOcmf_lA.js";import"./styled-CDWDroQT.js";import"./TextField-Cxr_oRcd.js";import"./Select-BiZa7U2_.js";import"./index-B9sM2jn7.js";import"./Popover-CVjrgcBr.js";import"./Modal-BKS56bVv.js";import"./Portal-DGqwvRCH.js";import"./List-cHbFQZE_.js";import"./ListContext-B0O1h7iD.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-vZc3_jkZ.js";import"./FormLabel-CTwQ0ijh.js";import"./InputLabel-dk7h2aR5.js";import"./ListItem-BEnPhwl_.js";import"./ListItemIcon-DYqGMBoP.js";import"./ListItemText-DimjlXkG.js";import"./Remove-BgxK_qxF.js";import"./useCopyToClipboard-BxYbXeOS.js";import"./Button-CfP9f6s1.js";import"./Divider-AcqAP6v2.js";import"./FormControlLabel-DFQlprJ1.js";import"./Checkbox-DON7r79u.js";import"./SwitchBase-CwGiJYfM.js";import"./RadioGroup-SHFA-nTo.js";import"./MenuItem-CfIzosgl.js";import"./translation-DohfiIhr.js";import"./DialogTitle-DjDrvKqf.js";import"./Backdrop-BSizeznv.js";import"./Tooltip-pAeb8IBW.js";import"./Popper-Cpjma44V.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-Bzm8vBui.js";import"./Edit-DVm06agW.js";import"./Cancel-D_Z2kqMU.js";import"./Progress-BzcYe5db.js";import"./LinearProgress-CkBhpkbV.js";import"./ContentHeader-BVvbWCeG.js";import"./Helmet-DDpxLF7s.js";import"./ErrorBoundary-BfsUlOJh.js";import"./ErrorPanel-0ntfFJ4u.js";import"./WarningPanel-CWtEeF6X.js";import"./ExpandMore-DmZgnz1E.js";import"./AccordionDetails-vmXM40VX.js";import"./Collapse-BtERTKf9.js";import"./MarkdownContent-DGJWTS_J.js";import"./CodeSnippet-B745YxT9.js";import"./CopyTextButton-BU9NUfM0.js";import"./LinkButton-GCBw9_0G.js";import"./Link-YMEncvsI.js";import"./useElementFilter-DRbcGvCE.js";import"./InfoCard-C3e3GLYI.js";import"./CardContent-DD931SVo.js";import"./CardHeader-DuQKXcju.js";import"./CardActions-DaFtt8Y8.js";import"./BottomLink-DY3jThaC.js";import"./ArrowForward-lqL8v-HC.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
