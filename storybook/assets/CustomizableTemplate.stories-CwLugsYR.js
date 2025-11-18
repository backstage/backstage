import{j as t,T as i,c as m,C as a}from"./iframe-BJLAQiny.js";import{w as n}from"./appWrappers-Ch3ZwAuI.js";import{s as p,H as s}from"./plugin-DdYoI9xx.js";import{c as d}from"./api-Nw2e3ZdR.js";import{c}from"./catalogApiMock-ohP6dS8R.js";import{M as g}from"./MockStarredEntitiesApi-B5O3hYnW.js";import{s as l}from"./api-DTqee4sT.js";import{C as h}from"./CustomHomepageGrid-UV66eI7G.js";import{H as f,a as u}from"./plugin-B5ZLJ7gh.js";import{e as y}from"./routes-BX-MuSSr.js";import{s as w}from"./StarredEntitiesApi-DEqcsHKE.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-DxZEzPKu.js";import"./useIsomorphicLayoutEffect-YDmtHS5G.js";import"./useAnalytics-W203HJ0-.js";import"./useAsync-D_PwxK1T.js";import"./useMountedState-DW1n1H5-.js";import"./componentData-Bg3JyZcy.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-bnZRQeHC.js";import"./useApp-BTkCnRE2.js";import"./index-BSxJtKs0.js";import"./Plugin-CG7_4OWW.js";import"./useRouteRef-CVo3EImE.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-Bqv0TgVV.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-Z4wxHZn4.js";import"./Grid-85KaXqj6.js";import"./Box-DBjVidWA.js";import"./styled-Dbum34QX.js";import"./TextField-CgBMAxsv.js";import"./Select-DPb2sQRT.js";import"./index-DnL3XN75.js";import"./Popover-BTSzFMjF.js";import"./Modal-98ZwNGha.js";import"./Portal-B2YIacrT.js";import"./List-DMFoD1Fa.js";import"./ListContext-HC4v7bkz.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CYB0Xnn0.js";import"./FormLabel-DPIvM0BG.js";import"./InputLabel-Dtef0gRY.js";import"./ListItem-Ccj_bLuX.js";import"./ListItemIcon-Cxtfu6Dv.js";import"./ListItemText-B0trVnJh.js";import"./Remove-fjXXiHbJ.js";import"./useCopyToClipboard-WIY93EcD.js";import"./Button-CtgRUIFg.js";import"./Divider-DsKh9GaH.js";import"./FormControlLabel-DNROpDM4.js";import"./Checkbox-ByzZ54Zr.js";import"./SwitchBase-BgFmmPjR.js";import"./RadioGroup-BAFiGLT1.js";import"./MenuItem-Ctu1yU60.js";import"./translation-ycpzvNM3.js";import"./DialogTitle-BYsWp0dH.js";import"./Backdrop-BKPXV1ri.js";import"./Tooltip-DWt_B2xO.js";import"./Popper-DQtSbLkc.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-LFnCTAaN.js";import"./Edit-BdYr9CGr.js";import"./Cancel-Bob4VraY.js";import"./Progress-BmTF_qQn.js";import"./LinearProgress-CZhdSkeH.js";import"./ContentHeader-CajDcFHS.js";import"./Helmet-C6E4itJJ.js";import"./ErrorBoundary-iG0FMg2_.js";import"./ErrorPanel-C7O53zca.js";import"./WarningPanel-Cx0u9N3G.js";import"./ExpandMore-C9SKMfwh.js";import"./AccordionDetails-BeK8TLKU.js";import"./Collapse-Dyo3yIeQ.js";import"./MarkdownContent-C9K6rk9j.js";import"./CodeSnippet-BCiMU4qs.js";import"./CopyTextButton-qCRVuup2.js";import"./LinkButton-B7rqQyTO.js";import"./Link-BsQxZTCc.js";import"./useElementFilter-CBL8LEF3.js";import"./InfoCard-yPFTnu1Z.js";import"./CardContent-C84WVsF3.js";import"./CardHeader-DOZJLl26.js";import"./CardActions-Cs4T3KjN.js";import"./BottomLink-Wm-pDfIj.js";import"./ArrowForward-Ds6zgypX.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
