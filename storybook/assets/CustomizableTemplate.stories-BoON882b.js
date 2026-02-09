import{j as t,U as i,V as m,W as a}from"./iframe-CXYsSFqX.js";import{s as n,H as p}from"./plugin-CtBYKFwY.js";import{c as s}from"./api-jhn8vFaR.js";import{c as d}from"./catalogApiMock-Du_Q0Bd1.js";import{M as c}from"./MockStarredEntitiesApi-DbVVe0Aw.js";import{s as g}from"./api-D9jKqI1j.js";import{C as l}from"./CustomHomepageGrid-5vC8YPnH.js";import{H as h,a as f}from"./plugin-D4U0AyrD.js";import{e as u}from"./routes-CHUBus_K.js";import{w as y}from"./appWrappers-DM9hoX1F.js";import{s as w}from"./StarredEntitiesApi-C4ViXcR3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-IzCJOiwo.js";import"./Plugin-CYVtm61E.js";import"./componentData-B-Xp-WjF.js";import"./useAnalytics-wpQnmzLK.js";import"./useApp-LC36H6z3.js";import"./useRouteRef-D_K4aVES.js";import"./index-mbELQmCK.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useObservable-Iu2rwe2U.js";import"./useIsomorphicLayoutEffect-D0goBYeo.js";import"./isObject--vsEa_js.js";import"./isSymbol-DYihM2bc.js";import"./toString-jlmj72dF.js";import"./Add-De15lJw6.js";import"./Grid-CBLufU_i.js";import"./Box-DCh7b65F.js";import"./styled-DYzq_tB8.js";import"./TextField-BJUIp_EF.js";import"./Select-ZDSVzv3O.js";import"./index-B9sM2jn7.js";import"./Popover-Cjl51Zxu.js";import"./Modal-D6jcPeuR.js";import"./Portal-y4yvUJUe.js";import"./List-CDWQPT5T.js";import"./ListContext-CWoF9LZC.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B5QZVaVY.js";import"./FormLabel-XSOpFhvr.js";import"./InputLabel-C9B99LW5.js";import"./ListItem-DLX99J84.js";import"./ListItemIcon--c4uLQGt.js";import"./ListItemText-CvzrIeis.js";import"./Remove-Be5r0nLB.js";import"./useCopyToClipboard-BZhXOA9g.js";import"./useMountedState-2cXymIoR.js";import"./Button-D0m-IwQo.js";import"./Divider-DuenxdSn.js";import"./FormControlLabel-DNSIqRIb.js";import"./Checkbox-C5aOkirn.js";import"./SwitchBase-5eN4A7Ua.js";import"./RadioGroup-DWtbiXNh.js";import"./MenuItem-lcLkX3GF.js";import"./translation-tj5o9xgF.js";import"./DialogTitle-CexE-OMt.js";import"./Backdrop-DpZkZfXy.js";import"./Tooltip-DYDrJaUH.js";import"./Popper-BaB5wJeP.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-IX_44xb0.js";import"./Edit-CI3y4u1I.js";import"./Cancel-BR8TpYPo.js";import"./Progress-Bmw2jChS.js";import"./LinearProgress-gtsyAZfs.js";import"./ContentHeader-tkrd-JGb.js";import"./Helmet-DDFNY1L8.js";import"./ErrorBoundary-BYKn89zI.js";import"./ErrorPanel-3Zd2cLU-.js";import"./WarningPanel-DIYvPX_4.js";import"./ExpandMore-DJZlK5Sd.js";import"./AccordionDetails-CCv3FdOB.js";import"./Collapse-BITvwjhQ.js";import"./MarkdownContent-Brn2l3Aj.js";import"./CodeSnippet-DkEMDFHo.js";import"./CopyTextButton-DFxCHX8I.js";import"./LinkButton-DyFnZC8S.js";import"./Link-DWEj90Ez.js";import"./useElementFilter-Bfb3gdrY.js";import"./InfoCard-BhEjsNW2.js";import"./CardContent-BfiKMwCo.js";import"./CardHeader-kRzKqXby.js";import"./CardActions-DornRNWZ.js";import"./BottomLink-D1PtYDTo.js";import"./ArrowForward-Ak_-qeRR.js";import"./useAsync-CNZKjAjJ.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=d({entities:x}),o=new c;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>y(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[s,k],[w,o],[g,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":n.routes.root,"/catalog/:namespace/:kind/:name":u}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(l,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(p,{}),t.jsx(h,{}),t.jsx(f,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
