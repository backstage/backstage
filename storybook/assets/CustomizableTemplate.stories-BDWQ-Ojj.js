import{j as t,T as i,c as m,C as a}from"./iframe-DZkam7Bj.js";import{w as n}from"./appWrappers-Bg6ecWLG.js";import{s as p,H as s}from"./plugin-Bl7BuGsa.js";import{c as d}from"./api-DliB_FM6.js";import{c}from"./catalogApiMock-DxFmppLJ.js";import{M as g}from"./MockStarredEntitiesApi-DrdxhWLC.js";import{s as l}from"./api-apMlJzbK.js";import{C as h}from"./CustomHomepageGrid-Bkmp4IiI.js";import{H as f,a as u}from"./plugin-D6dEO2vP.js";import{e as y}from"./routes-CNUg9jsV.js";import{s as w}from"./StarredEntitiesApi-BtUs4Rx8.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-CEhyWTyT.js";import"./useIsomorphicLayoutEffect-DFCzL8zZ.js";import"./useAnalytics-RqWf-jVc.js";import"./useAsync-BRCkrjty.js";import"./useMountedState-ChfRzppL.js";import"./componentData-D2mgrz7C.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BYedHEZ0.js";import"./useApp-CAfcC71X.js";import"./index-Cy-AkiNB.js";import"./Plugin-D0wcgIxz.js";import"./useRouteRef-BbGjzdGG.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./Add-DH_eZXNM.js";import"./Grid-DBMZs7np.js";import"./Box-DChwE7Ki.js";import"./styled-RI4GT_4U.js";import"./TextField-BIDDbRCE.js";import"./Select-RPFPlcQc.js";import"./index-B9sM2jn7.js";import"./Popover-H9d7tLDo.js";import"./Modal-Dli2H9pG.js";import"./Portal-mqL5KVNN.js";import"./List-Ca4J4jzY.js";import"./ListContext-D7S-zqsj.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Bow_Y-R1.js";import"./FormLabel-5WzzBTLf.js";import"./InputLabel-BS7L9kZn.js";import"./ListItem-DNrM1AYn.js";import"./ListItemIcon-WCF4l5uO.js";import"./ListItemText-CiywuPc3.js";import"./Remove-BKg3WRpd.js";import"./useCopyToClipboard-DSpaqeDH.js";import"./Button-C84XLh64.js";import"./Divider-CrMgh5SC.js";import"./FormControlLabel-BLr4iuM8.js";import"./Checkbox-Di6xTSCP.js";import"./SwitchBase-cWGQD-P0.js";import"./RadioGroup-EViZSJ8C.js";import"./MenuItem-DOAQS7yJ.js";import"./translation-CqQtIenM.js";import"./DialogTitle-BODx1QEM.js";import"./Backdrop-970MLPke.js";import"./Tooltip-D0UPjqYE.js";import"./Popper-CT_phagK.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-DhywlzNP.js";import"./Edit-DNfQci_Y.js";import"./Cancel-DxDR56ut.js";import"./Progress-Cs6T_nD_.js";import"./LinearProgress-BsMMUx7S.js";import"./ContentHeader-hKZvflJN.js";import"./Helmet-3ZyT5gkJ.js";import"./ErrorBoundary-UF8MZD5v.js";import"./ErrorPanel-DvnF6D1Z.js";import"./WarningPanel-W5ZE-W22.js";import"./ExpandMore-B142-YHG.js";import"./AccordionDetails-4Wsid_gA.js";import"./Collapse-CyMpxX-e.js";import"./MarkdownContent-0F8rqmt_.js";import"./CodeSnippet-BFE5NLd5.js";import"./CopyTextButton-Bji7cX2P.js";import"./LinkButton-DWub5hGG.js";import"./Link-BoLwiIPW.js";import"./useElementFilter-BHEEoc09.js";import"./InfoCard-DESjlp5V.js";import"./CardContent-m46vxV1w.js";import"./CardHeader-CDP-7wiu.js";import"./CardActions-DiMkl16p.js";import"./BottomLink-DmPOneGd.js";import"./ArrowForward-DJhLoZFc.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
