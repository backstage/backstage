import{j as t,T as i,c as m,C as a}from"./iframe-Dl820wOI.js";import{w as n}from"./appWrappers-BD3uh5nl.js";import{s as p,H as s}from"./plugin-CJ55tAHj.js";import{c as d}from"./api-2qiXfms0.js";import{c}from"./catalogApiMock-Bkn38_01.js";import{M as g}from"./MockStarredEntitiesApi-C4Khk5lc.js";import{s as l}from"./api-bX86jQEN.js";import{C as h}from"./CustomHomepageGrid-BYVu0BLI.js";import{H as f,a as u}from"./plugin-BaRFzbFH.js";import{e as y}from"./routes-BXJFC_S5.js";import{s as w}from"./StarredEntitiesApi-Dl02oV3c.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-C0M1HCkm.js";import"./useIsomorphicLayoutEffect-BfWFNjzn.js";import"./useAnalytics-H66oe0oN.js";import"./useAsync-BnrwJMnZ.js";import"./useMountedState-C0tKh2p0.js";import"./componentData-9E7-GlxJ.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-Dc9OD8OQ.js";import"./useApp-B5QaOHzA.js";import"./index-D25X2y_G.js";import"./Plugin-3vtTV61V.js";import"./useRouteRef-C9mydBcp.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-CQ_HbK-K.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-BMI4SayT.js";import"./Grid-BlSwvCAu.js";import"./Box-DfeHQWeE.js";import"./styled-kfqHWboF.js";import"./TextField-C8dQAzK_.js";import"./Select-CIc-d9z8.js";import"./index-DnL3XN75.js";import"./Popover-DbocIA8t.js";import"./Modal-DWfTsRMv.js";import"./Portal-jLwVh-5o.js";import"./List-CHKnkhL9.js";import"./ListContext-Cbtrueie.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C6yRTLvD.js";import"./FormLabel-BDao_Jja.js";import"./InputLabel-BOxel5ik.js";import"./ListItem-Bj_ICtqE.js";import"./ListItemIcon-DrGWVCyr.js";import"./ListItemText-D5ck7_4o.js";import"./Remove-Cc6Cijtz.js";import"./useCopyToClipboard-y5aTqnvo.js";import"./Button-BNshOWAl.js";import"./Divider-BgKPwKXb.js";import"./FormControlLabel-Cg84z-6_.js";import"./Checkbox-BsNDRpdz.js";import"./SwitchBase-DSh0MH59.js";import"./RadioGroup-DZc61L9l.js";import"./MenuItem-Blnz45KO.js";import"./translation-BcbspRt0.js";import"./DialogTitle-CxtWIpkN.js";import"./Backdrop-BMrQTwpi.js";import"./Tooltip-DqMu2rNF.js";import"./Popper-CWjD6Kfi.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-DvEbUOCx.js";import"./Edit-CfgYK-9r.js";import"./Cancel-kvETNM7K.js";import"./Progress-t-nyfFOY.js";import"./LinearProgress-NJqlj10q.js";import"./ContentHeader-B_4T0PCD.js";import"./Helmet-C3jO1hGc.js";import"./ErrorBoundary-TU5r1TN3.js";import"./ErrorPanel-Bkv9ZIFz.js";import"./WarningPanel-CQQpX2Kh.js";import"./ExpandMore-BlvUDGnA.js";import"./AccordionDetails-vMLxVx9E.js";import"./Collapse-s2rcogEo.js";import"./MarkdownContent-Cgb47FM9.js";import"./CodeSnippet-C8tyMWnK.js";import"./CopyTextButton-Dfef_A-E.js";import"./LinkButton-C-wRK3uh.js";import"./Link-BTOOY6TC.js";import"./useElementFilter-MLea2u1h.js";import"./InfoCard-Bz2zmd-3.js";import"./CardContent-BbppD0Sf.js";import"./CardHeader-DGlc83ja.js";import"./CardActions-DERKWDxO.js";import"./BottomLink-CrHLb6uy.js";import"./ArrowForward-Bcalu6Is.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
