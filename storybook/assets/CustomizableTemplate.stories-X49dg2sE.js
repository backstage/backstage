import{j as t,T as i,c as m,C as a}from"./iframe-Dg7jNfgV.js";import{w as n}from"./appWrappers-Dhyq66xu.js";import{s as p,H as s}from"./plugin-CNPokr64.js";import{c as d}from"./api-DHD_edXW.js";import{c}from"./catalogApiMock-CmvUesQD.js";import{M as g}from"./MockStarredEntitiesApi-5sVIErQD.js";import{s as l}from"./api-CU8DSyC9.js";import{C as h}from"./CustomHomepageGrid-hLCbR7Xl.js";import{H as f,a as u}from"./plugin-BpfyQ0vQ.js";import{e as y}from"./routes-CqIHr0Bo.js";import{s as w}from"./StarredEntitiesApi-ACPpJh1J.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-BZnIpjCU.js";import"./useIsomorphicLayoutEffect-BlM3Hzgi.js";import"./useAnalytics-DDAI3Sby.js";import"./useAsync-DkNvCakU.js";import"./useMountedState-6AheAbGL.js";import"./componentData-CzpKGprp.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-DJhhhiwK.js";import"./useApp-DBejBM5d.js";import"./index-DHdHtyHw.js";import"./Plugin-G9-uH3UY.js";import"./useRouteRef-BE4yvNyY.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-UdrOSUaf.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-CXftCoDi.js";import"./Grid-DZoxUphm.js";import"./Box-Bmqbh7u4.js";import"./styled-CMe42Sps.js";import"./TextField-B_qhexU1.js";import"./Select-Dbf0pSrJ.js";import"./index-DnL3XN75.js";import"./Popover-BRFYuyYy.js";import"./Modal-CaeBjbT7.js";import"./Portal-DaCRxhVb.js";import"./List-CB5Cl-bM.js";import"./ListContext-DjmviigF.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CmqbUbAp.js";import"./FormLabel-BeJBp0CO.js";import"./InputLabel-CXLmwbDB.js";import"./ListItem-WexTgdCu.js";import"./ListItemIcon-D6-_4h2Y.js";import"./ListItemText-DJB03TAT.js";import"./Remove-COZ7w66s.js";import"./useCopyToClipboard-CoeOzktD.js";import"./Button-CrARaf08.js";import"./Divider-ithO4Mrh.js";import"./FormControlLabel-bZSiLE9j.js";import"./Checkbox-C-eunBv1.js";import"./SwitchBase-Da9dUX43.js";import"./RadioGroup-CaeAPMfj.js";import"./MenuItem-BWCz3K9l.js";import"./translation-9Ropd0Mc.js";import"./DialogTitle-BGuqEob6.js";import"./Backdrop-INLhdtBn.js";import"./Tooltip-hjut9A6-.js";import"./Popper-DfjHoTPM.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BfakGP5T.js";import"./Edit-isIpM0yh.js";import"./Cancel-DjA5KPvn.js";import"./Progress-DjezaQkc.js";import"./LinearProgress-jzzSe_jD.js";import"./ContentHeader-BgkvXkra.js";import"./Helmet-BcSQLsNg.js";import"./ErrorBoundary-DF2UJt6Z.js";import"./ErrorPanel-CFu8Rfin.js";import"./WarningPanel-D2enhZvg.js";import"./ExpandMore-B7ltQ0WG.js";import"./AccordionDetails-CFRyv9zh.js";import"./Collapse-BXYqoVfQ.js";import"./MarkdownContent-XjtKEh5y.js";import"./CodeSnippet-DJ-lPCL_.js";import"./CopyTextButton-CNGlDDM9.js";import"./LinkButton-CpCeZYF_.js";import"./Link-gNdToM-H.js";import"./useElementFilter-BTTrnlJy.js";import"./InfoCard-YTF1zP1R.js";import"./CardContent-YBBmqTdA.js";import"./CardHeader-W6MdNAvW.js";import"./CardActions-CH0H7gTz.js";import"./BottomLink-DgZkINS1.js";import"./ArrowForward-B5pYWWYy.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
