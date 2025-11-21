import{j as t,T as i,c as m,C as a}from"./iframe-C8ExrwzU.js";import{w as n}from"./appWrappers-BaMznTf3.js";import{s as p,H as s}from"./plugin-Bj8NWHpe.js";import{c as d}from"./api-C7Oojffb.js";import{c}from"./catalogApiMock-BFDjK0lp.js";import{M as g}from"./MockStarredEntitiesApi-CdOr-cND.js";import{s as l}from"./api-C-n-MJyU.js";import{C as h}from"./CustomHomepageGrid-BECZIKTN.js";import{H as f,a as u}from"./plugin-Cege8qGM.js";import{e as y}from"./routes-DJ4jugAK.js";import{s as w}from"./StarredEntitiesApi-xhtvRoUY.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-D53Q4Zoo.js";import"./useIsomorphicLayoutEffect-CxciEqLm.js";import"./useAnalytics-BlYc1avD.js";import"./useAsync-DwtigoPq.js";import"./useMountedState-UCRwgIDM.js";import"./componentData-Dj-cJqs3.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-BgOC1FTX.js";import"./useApp-C7pfrKGm.js";import"./index-ldVdSwr-.js";import"./Plugin-B2v-vDzx.js";import"./useRouteRef-C6pJYPst.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-jh5ldoOU.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-BjX6gOc9.js";import"./Grid-DspeJWIy.js";import"./Box-DKI1NtYF.js";import"./styled-BZchgpfg.js";import"./TextField-Dl2S-w0i.js";import"./Select-BB1iku1A.js";import"./index-DnL3XN75.js";import"./Popover-CXulOKja.js";import"./Modal-DbOcvVvU.js";import"./Portal-BvPm8y4I.js";import"./List-D4oyelOm.js";import"./ListContext-D23aAr-N.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DDK_wWJv.js";import"./FormLabel-BydTPjTE.js";import"./InputLabel-BIW6m-K0.js";import"./ListItem-DGmfxxZu.js";import"./ListItemIcon-DOJ7JJRo.js";import"./ListItemText-CIKs-KSS.js";import"./Remove-BPurvFMP.js";import"./useCopyToClipboard-CrQaQuzV.js";import"./Button-BirFLWZh.js";import"./Divider-4xHmk1Qy.js";import"./FormControlLabel-DPMPV2EU.js";import"./Checkbox-CIaSHDW8.js";import"./SwitchBase-DU4fmETg.js";import"./RadioGroup-BvWTAX7I.js";import"./MenuItem-VkQJwqij.js";import"./translation-CEn3zhiJ.js";import"./DialogTitle-B89siiWU.js";import"./Backdrop-86Drsiia.js";import"./Tooltip-rFR9MD6z.js";import"./Popper-BQ20DEXn.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-Ybz6-2Nb.js";import"./Edit-BJCWqzs_.js";import"./Cancel-CmDLTloy.js";import"./Progress-DsNmWByX.js";import"./LinearProgress-rc3oEMhp.js";import"./ContentHeader-CMX8mYcQ.js";import"./Helmet-C7QrBxsC.js";import"./ErrorBoundary-F_hBtf1o.js";import"./ErrorPanel-CDFCJhtV.js";import"./WarningPanel-CfgTJdNP.js";import"./ExpandMore-CE-AlmPZ.js";import"./AccordionDetails-CKE4MG-J.js";import"./Collapse-DuUvJIAd.js";import"./MarkdownContent-CQVlpVaR.js";import"./CodeSnippet-BRYqmlwq.js";import"./CopyTextButton-CfcOHHdO.js";import"./LinkButton-DxVeoCL2.js";import"./Link-D0uGQ-EQ.js";import"./useElementFilter-CmH0_Gul.js";import"./InfoCard-D_4zmvid.js";import"./CardContent-BgCJnSoO.js";import"./CardHeader-BB7CXK1i.js";import"./CardActions-BOmf1H7g.js";import"./BottomLink-DMese3Ls.js";import"./ArrowForward-Dcuc9hR9.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
