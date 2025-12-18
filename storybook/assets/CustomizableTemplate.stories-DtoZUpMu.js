import{j as t,T as i,c as m,C as a}from"./iframe-BY8lR-L8.js";import{w as n}from"./appWrappers-CwbFz284.js";import{s as p,H as s}from"./plugin-opx4upFJ.js";import{c as d}from"./api-B0zT31CA.js";import{c}from"./catalogApiMock-Du4o6xCm.js";import{M as g}from"./MockStarredEntitiesApi-CMRKilx_.js";import{s as l}from"./api-ZUH36i94.js";import{C as h}from"./CustomHomepageGrid-CuPreSDV.js";import{H as f,a as u}from"./plugin-BzoiYKlF.js";import{e as y}from"./routes-CVFW2Fao.js";import{s as w}from"./StarredEntitiesApi-BhTMslHy.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-DjQNHeFS.js";import"./useIsomorphicLayoutEffect-4IAuBrOv.js";import"./useAnalytics-BVxeCBFY.js";import"./useAsync-DNLOGNju.js";import"./useMountedState-DwTRr6Bf.js";import"./componentData-UKDdzeuB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-BS6rRTnv.js";import"./useApp-BvPEffuf.js";import"./index-BWkWUfDc.js";import"./Plugin-pD8p1KrB.js";import"./useRouteRef-X5r9b_hf.js";import"./ref-C0VTUPuL.js";import"./lodash-Y_-RFQgK.js";import"./Add-BI2OVkvQ.js";import"./Grid-BjrJvsR3.js";import"./Box-COui6GIh.js";import"./styled-Ckl9NdN2.js";import"./TextField-CmNjY28o.js";import"./Select-D8Je2o65.js";import"./index-B9sM2jn7.js";import"./Popover-C5Oe9S6O.js";import"./Modal-ob7ZinQq.js";import"./Portal-9M61fEx6.js";import"./List-Zd71n2FM.js";import"./ListContext-CBZm9pJe.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DQzfReps.js";import"./FormLabel-BTmno_qp.js";import"./InputLabel-C_1lyP9G.js";import"./ListItem-CGZ3ypeU.js";import"./ListItemIcon-BUUsm_I5.js";import"./ListItemText-BFb2Grym.js";import"./Remove-BKB643DX.js";import"./useCopyToClipboard-Bl5GfTuC.js";import"./Button-DOtnJgPP.js";import"./Divider-C9c6KGoD.js";import"./FormControlLabel-CCcVfjdn.js";import"./Checkbox-1pjU2CIe.js";import"./SwitchBase-CnsDPG4Q.js";import"./RadioGroup-BLP4Ic4S.js";import"./MenuItem-j4N1CzUe.js";import"./translation-BPlbTx_b.js";import"./DialogTitle-DJH-tFiF.js";import"./Backdrop-NlvjxJvh.js";import"./Tooltip-CQzh8PM4.js";import"./Popper-CAf4oxXD.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-DAtj8HNM.js";import"./Edit-B1mrniiJ.js";import"./Cancel-BvaM4lNA.js";import"./Progress-CRwW-NBP.js";import"./LinearProgress-RnbnNz5Q.js";import"./ContentHeader-ClK5T-7l.js";import"./Helmet-CpnMSKfo.js";import"./ErrorBoundary-BxthC0Iq.js";import"./ErrorPanel-DUhzHP9c.js";import"./WarningPanel-wg4n1CXF.js";import"./ExpandMore-fkHecgaQ.js";import"./AccordionDetails-Fks5AbbD.js";import"./Collapse-B6v7_Lug.js";import"./MarkdownContent-CEOHELvX.js";import"./CodeSnippet-ajdkoRYg.js";import"./CopyTextButton-HjsOaOKI.js";import"./LinkButton-0O3nZFeQ.js";import"./Link-CG56jGaN.js";import"./useElementFilter-CqXfM3jD.js";import"./InfoCard-9a18SuEb.js";import"./CardContent-B8GBl9qU.js";import"./CardHeader-Hrxg6OrZ.js";import"./CardActions-D47ZvRGZ.js";import"./BottomLink-C0C-DKvG.js";import"./ArrowForward-BmZGDfYA.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
