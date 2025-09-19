import{j as t,T as i,c as m,C as a}from"./iframe-hd6BgcQH.js";import{w as n}from"./appWrappers-Ci8V8MLf.js";import{s as p,H as s}from"./plugin-B56SQr8t.js";import{c as d}from"./api-DNqHLG7A.js";import{c}from"./catalogApiMock-B8JcgluX.js";import{M as g}from"./MockStarredEntitiesApi-DMc5kgRe.js";import{s as l}from"./api-Bev5I2Sd.js";import{C as h}from"./CustomHomepageGrid-DQT5Hr0-.js";import{H as f,a as u}from"./plugin-92FY2VfE.js";import{e as y}from"./routes-DcA3o41U.js";import{s as w}from"./StarredEntitiesApi-BgGec0Cc.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-C2Ift1hU.js";import"./useAnalytics-BNw5WHP5.js";import"./useAsync-DlvFpJJJ.js";import"./useMountedState-BwuO-QSl.js";import"./componentData-Cp5cye-b.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-BvioCNb0.js";import"./useApp-D57mFECn.js";import"./index-B1O3cqUv.js";import"./Plugin-iM4X_t4D.js";import"./useRouteRef-BFQKnc9G.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-DBL2B5mS.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-ECsycNsj.js";import"./Grid-C4Dm4yGa.js";import"./Box-C4_Hx4tK.js";import"./styled-Csv0DLFw.js";import"./TextField-DzMopK_m.js";import"./Select-FOK1voHD.js";import"./index-DnL3XN75.js";import"./Popover-w_sS1QxY.js";import"./Modal-DC-l3nZj.js";import"./Portal-QtjodaYU.js";import"./List-Eydl9qQR.js";import"./ListContext-DMV1tqqG.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C7qHenqP.js";import"./FormLabel-CeQe378n.js";import"./InputLabel-CWkIs-bu.js";import"./ListItem-BuICECdF.js";import"./ListItemIcon-B1o-6Fru.js";import"./ListItemText-B0MXj_oA.js";import"./Remove-CIWuQfmI.js";import"./useCopyToClipboard-ZIjVTeCY.js";import"./Button-3MbgNa_D.js";import"./Divider-BsrVsHFl.js";import"./FormControlLabel-B82Ar06a.js";import"./Checkbox-CoxSolwl.js";import"./SwitchBase-BJsD66a1.js";import"./RadioGroup-CQyIePCE.js";import"./MenuItem-3YpUlPNQ.js";import"./translation-MIKvvwWE.js";import"./DialogTitle-BJGjv1lD.js";import"./Backdrop-TGnaLO6W.js";import"./Tooltip-DHFXXWJ1.js";import"./Popper-BLI_ywQx.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-14ffE1AK.js";import"./Edit-DGOGaOR8.js";import"./Cancel-CKpDhpP2.js";import"./Progress-2Cr9pXgW.js";import"./LinearProgress-DPLa7KRD.js";import"./ContentHeader-BLMtIyJ-.js";import"./Helmet-54I3Et5U.js";import"./ErrorBoundary-BxDyxJNA.js";import"./ErrorPanel-pwFCh6zc.js";import"./WarningPanel-Le2tKfrN.js";import"./ExpandMore-C7-67hd9.js";import"./AccordionDetails-DosuP5Ed.js";import"./Collapse-D-UdipB4.js";import"./MarkdownContent-aZlBpoZT.js";import"./CodeSnippet-BlQm8FHA.js";import"./CopyTextButton-C8AIAO8L.js";import"./LinkButton-DUOFEHwI.js";import"./Link-DIsoXdRS.js";import"./useElementFilter-CN_R6oRp.js";import"./InfoCard-DXQ7_Apb.js";import"./CardContent-Da9FNRpD.js";import"./CardHeader-ChJbkXh1.js";import"./CardActions-Ci4WOTdw.js";import"./BottomLink-BlsHV6Ti.js";import"./ArrowForward-Bdq2LjKG.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ie={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
}`,...e.parameters?.docs?.source}}};const me=["CustomizableTemplate"];export{e as CustomizableTemplate,me as __namedExportsOrder,ie as default};
