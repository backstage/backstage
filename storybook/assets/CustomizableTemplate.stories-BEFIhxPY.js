import{j as t,T as i,c as m,C as a}from"./iframe-D1GFiJZo.js";import{w as n}from"./appWrappers-DsMAuWKH.js";import{s as p,H as s}from"./plugin-c1vXF8SX.js";import{c as d}from"./api-DmnGfimw.js";import{c}from"./catalogApiMock-DgAItH2H.js";import{M as g}from"./MockStarredEntitiesApi-KR7cj_pE.js";import{s as l}from"./api-De_PjT1Y.js";import{C as h}from"./CustomHomepageGrid-DXVK7k63.js";import{H as f,a as u}from"./plugin-CKgXZTOa.js";import{e as y}from"./routes-Q3Q6KnUW.js";import{s as w}from"./StarredEntitiesApi-D66mcyWw.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-mQQsnksj.js";import"./useIsomorphicLayoutEffect-C1EkHGJN.js";import"./useAnalytics-CoSsSvYs.js";import"./useAsync-B9mAtbAn.js";import"./useMountedState-qz1JMqOw.js";import"./componentData-B3mVAfsp.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-DKQ8ROEi.js";import"./useApp-DQ-5E_lb.js";import"./index-3az-8BBE.js";import"./Plugin-DzFxQMSf.js";import"./useRouteRef-DO_E-PIP.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-DBAm_IO7.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-CSZP8-oZ.js";import"./Grid-C_DJ7CXy.js";import"./Box-_YREnRyM.js";import"./styled-CDUeIV7m.js";import"./TextField-CGlidW6B.js";import"./Select-ezLRWI68.js";import"./index-DnL3XN75.js";import"./Popover-C7YRUsdO.js";import"./Modal-Cfmtm0OK.js";import"./Portal-B8zTs1MC.js";import"./List-kH2EmDt_.js";import"./ListContext-BZJs2wbx.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-hVy1xBfJ.js";import"./FormLabel-DiBKMpdQ.js";import"./InputLabel-m1nCNF1Y.js";import"./ListItem-DWHRsh5J.js";import"./ListItemIcon-XzV9ADgi.js";import"./ListItemText-ioovX8R3.js";import"./Remove-D6mIUDSD.js";import"./useCopyToClipboard-BYpPSSth.js";import"./Button-DZDIOJUc.js";import"./Divider-CCA28OD_.js";import"./FormControlLabel-Diw3ytPm.js";import"./Checkbox-nNn2rS54.js";import"./SwitchBase-D7D59pbg.js";import"./RadioGroup-DCfQ5yg7.js";import"./MenuItem-C8UFx-bg.js";import"./translation-CikMtncz.js";import"./DialogTitle-BrPPzfXC.js";import"./Backdrop-ClAhZkYO.js";import"./Tooltip-hGuiE2Q3.js";import"./Popper-CVVnhvaK.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-zspWpLm5.js";import"./Edit-Bb35nOqH.js";import"./Cancel-Ck-t9w8X.js";import"./Progress-C9FqV-YY.js";import"./LinearProgress-D5nKB5p1.js";import"./ContentHeader-DYmr1T38.js";import"./Helmet-CJR6Lwpk.js";import"./ErrorBoundary-BGnIfumD.js";import"./ErrorPanel-DW_UBsf7.js";import"./WarningPanel-Cp7h97Xz.js";import"./ExpandMore-C5Qt4VBZ.js";import"./AccordionDetails-CHtH84ap.js";import"./Collapse-DDq3EAkH.js";import"./MarkdownContent-B_nTIlyA.js";import"./CodeSnippet-C5RtD8fm.js";import"./CopyTextButton-p_Y8WBTg.js";import"./LinkButton-CABNA6l3.js";import"./Link-B1KKwcLj.js";import"./useElementFilter-D5sH091H.js";import"./InfoCard-DNXQeFaq.js";import"./CardContent-CDDk_fHy.js";import"./CardHeader-HwFA-nax.js";import"./CardActions-BH1q8i_s.js";import"./BottomLink-BFyTmqMM.js";import"./ArrowForward-DKYzAO2n.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
