import{j as t,T as i,c as m,C as a}from"./iframe-CA0Xqitl.js";import{w as n}from"./appWrappers-OMKuIXpb.js";import{s as p,H as s}from"./plugin-BsbL5fQk.js";import{c as d}from"./api-Bsfaf5B0.js";import{c}from"./catalogApiMock-j13bK_B1.js";import{M as g}from"./MockStarredEntitiesApi-BQo-7TQw.js";import{s as l}from"./api-Bb3c_gWr.js";import{C as h}from"./CustomHomepageGrid-DZ_wKSZZ.js";import{H as f,a as u}from"./plugin-voUPehY7.js";import{e as y}from"./routes-ZhCvlOrQ.js";import{s as w}from"./StarredEntitiesApi-ByRrtbPm.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-DY424ZJv.js";import"./useIsomorphicLayoutEffect-rHGqqG8J.js";import"./useAnalytics-Bs3aHlE6.js";import"./useAsync-BGwS6Vz2.js";import"./useMountedState-zGQsXHvo.js";import"./componentData-CdEqgOPk.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-ByTVIOef.js";import"./useApp-DFdkDp9A.js";import"./index-Cbylfjtp.js";import"./Plugin-CwlDf1Ud.js";import"./useRouteRef-DoEb129Q.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./Add-CMbTRryQ.js";import"./Grid-B8o7JoCY.js";import"./Box-Ds7zC8BR.js";import"./styled-BOzNBejn.js";import"./TextField-CbQKOlJB.js";import"./Select-DNkSp5Jx.js";import"./index-B9sM2jn7.js";import"./Popover-BmPtjFBs.js";import"./Modal-CxVdZ6wB.js";import"./Portal-DUJxNLzx.js";import"./List-BnsnRWJY.js";import"./ListContext-TMUZkd5u.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BujB911u.js";import"./FormLabel-B3GaXop_.js";import"./InputLabel--gwgFf8r.js";import"./ListItem-BzxviKme.js";import"./ListItemIcon-Ck7nypoA.js";import"./ListItemText-BwZgc58h.js";import"./Remove-DB3JfqSD.js";import"./useCopyToClipboard-B8vbXgZE.js";import"./Button-CbaUxuKj.js";import"./Divider-Dil931lt.js";import"./FormControlLabel-BfTbRya1.js";import"./Checkbox-DCnPGni0.js";import"./SwitchBase-B3jb_k_h.js";import"./RadioGroup-CfwpcE5P.js";import"./MenuItem--GQa4AVk.js";import"./translation-A0wM_bO4.js";import"./DialogTitle-COZeQRP2.js";import"./Backdrop-Cdn7d1XZ.js";import"./Tooltip-CuEp3aUv.js";import"./Popper-yvDUz_ZU.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-Cp0xrwlg.js";import"./Edit-DfxTq4Zt.js";import"./Cancel-uqD2zrJu.js";import"./Progress-BMXpV-Rn.js";import"./LinearProgress-Bwo2YJzI.js";import"./ContentHeader-ZXRL_vPW.js";import"./Helmet-fH9Yjick.js";import"./ErrorBoundary-Brzk20pV.js";import"./ErrorPanel-xkUPraUn.js";import"./WarningPanel-DyFbjHtf.js";import"./ExpandMore-DfKPiaDM.js";import"./AccordionDetails-BewnNYiP.js";import"./Collapse-BpZh4zHv.js";import"./MarkdownContent-CWjBFtdf.js";import"./CodeSnippet-BbCr73he.js";import"./CopyTextButton-Bm7dvK1x.js";import"./LinkButton-mfjqNKAK.js";import"./Link-D1vtE7Ac.js";import"./useElementFilter-BsNM8GTW.js";import"./InfoCard-CWjsgdCI.js";import"./CardContent-CLH9eyHI.js";import"./CardHeader-CVthFMjM.js";import"./CardActions-Im4oiJ-Q.js";import"./BottomLink-BPv30Qn0.js";import"./ArrowForward-Di5ER0Ic.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
