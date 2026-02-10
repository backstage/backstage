import{j as t,U as i,V as m,W as a}from"./iframe-DA79yDb5.js";import{s as n,H as p}from"./plugin-Pizw1Yp2.js";import{c as s}from"./api-HfqloE_f.js";import{c as d}from"./catalogApiMock-P_b9LM88.js";import{M as c}from"./MockStarredEntitiesApi-CpE46KLz.js";import{s as g}from"./api-Q_UaGI12.js";import{C as l}from"./CustomHomepageGrid-DsjIAdTg.js";import{H as h,a as f}from"./plugin-DPO0j2JD.js";import{e as u}from"./routes-BxOBnJ17.js";import{w as y}from"./appWrappers-n6jVhqF6.js";import{s as w}from"./StarredEntitiesApi-BW6upxRZ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C7jcciOT.js";import"./Plugin-CYrkOIGL.js";import"./componentData-Cd7zESh7.js";import"./useAnalytics-C702rZt-.js";import"./useApp-PXZC3w6P.js";import"./useRouteRef-Vppi1dhZ.js";import"./index-Yr_6lw0r.js";import"./lodash-DGzVoyEp.js";import"./ref-C0VTUPuL.js";import"./useObservable-C8gw3qun.js";import"./useIsomorphicLayoutEffect-Bv5BjMnP.js";import"./isObject--vsEa_js.js";import"./isSymbol-DYihM2bc.js";import"./toString-jlmj72dF.js";import"./Add-Cg2PQusu.js";import"./Grid-BPnxYFEE.js";import"./Box-BVQ5Vy1y.js";import"./styled-BjxYaA7M.js";import"./TextField-BeDroJxR.js";import"./Select-CFAK0J49.js";import"./index-B9sM2jn7.js";import"./Popover-BhwuORe9.js";import"./Modal-B60MXtNN.js";import"./Portal-C0jNS9Vb.js";import"./List-nEGPw4NA.js";import"./ListContext-kCBY5dMI.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BmLf1aih.js";import"./FormLabel-TjC9rInK.js";import"./InputLabel-gd17kBpy.js";import"./ListItem-BvihMH8Z.js";import"./ListItemIcon-CA-UzzCC.js";import"./ListItemText-DGxuZd8I.js";import"./Remove-BX6TTmp3.js";import"./useCopyToClipboard-BnMS7Zdt.js";import"./useMountedState-3oFHoVCv.js";import"./Button-DhPtekNk.js";import"./Divider-CFY8fi3w.js";import"./FormControlLabel-BSrrj7Ri.js";import"./Checkbox-UrIrF_Y5.js";import"./SwitchBase-CsTKuz5r.js";import"./RadioGroup-MDbFskp1.js";import"./MenuItem-0_tH9IJJ.js";import"./translation-DyBeirHo.js";import"./DialogTitle-Cam7H8C2.js";import"./Backdrop-CHWN49VN.js";import"./Tooltip-DjxuUc5H.js";import"./Popper-Vz_SQ7W_.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-D1Hdbxy5.js";import"./Edit-Cep2TCEq.js";import"./Cancel-1znr7MKX.js";import"./Progress-B5b0WD3f.js";import"./LinearProgress-C0uoyjEV.js";import"./ContentHeader-CBnFnhvT.js";import"./Helmet-c6HUneFx.js";import"./ErrorBoundary-D_GuCvAD.js";import"./ErrorPanel-Cep-pimB.js";import"./WarningPanel-BYActx0S.js";import"./ExpandMore-DR_zyoTC.js";import"./AccordionDetails-BvhTDe-h.js";import"./Collapse-Cl5eVhLP.js";import"./MarkdownContent-GLKDok0W.js";import"./CodeSnippet-CVIRDvuJ.js";import"./CopyTextButton-BbvOylv0.js";import"./LinkButton-C7Vx68WK.js";import"./Link-QsBbL45G.js";import"./useElementFilter-CXQDWOpp.js";import"./InfoCard-DXBo22iI.js";import"./CardContent-DSz4cfwc.js";import"./CardHeader-BBlm1V9W.js";import"./CardActions-C6lGtMc4.js";import"./BottomLink-Bj6NYPog.js";import"./ArrowForward-2Mv1uxa3.js";import"./useAsync-DJl5sWtJ.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=d({entities:x}),o=new c;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>y(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[s,k],[w,o],[g,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":n.routes.root,"/catalog/:namespace/:kind/:name":u}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(l,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(p,{}),t.jsx(h,{}),t.jsx(f,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
