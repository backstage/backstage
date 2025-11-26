import{j as t,T as i,c as m,C as a}from"./iframe-DXt6I_1q.js";import{w as n}from"./appWrappers-BbpqoopC.js";import{s as p,H as s}from"./plugin-CfMx6kJs.js";import{c as d}from"./api-DzZbHMRP.js";import{c}from"./catalogApiMock-DEHyxqf7.js";import{M as g}from"./MockStarredEntitiesApi-Drn0oOsH.js";import{s as l}from"./api-GAYfXGd9.js";import{C as h}from"./CustomHomepageGrid-BoYdmjK6.js";import{H as f,a as u}from"./plugin-v6adl62a.js";import{e as y}from"./routes-DPKRmBPf.js";import{s as w}from"./StarredEntitiesApi-hpMZhztz.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-DTc_vT-Q.js";import"./useIsomorphicLayoutEffect-l4gsGf2N.js";import"./useAnalytics-CGIT0JTN.js";import"./useAsync-uNXDDhwP.js";import"./useMountedState-BEJ2TW9Z.js";import"./componentData-ErQLe4OM.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-kCs7zF-O.js";import"./useApp-Bi1KQAH_.js";import"./index-gHWkKDiR.js";import"./Plugin-DguzI5U9.js";import"./useRouteRef-CAgnkOiS.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-CV1yQJcW.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-BYGGHc3-.js";import"./Grid-S6xSP1g4.js";import"./Box-BQB-mg8-.js";import"./styled-Dla1Uw7W.js";import"./TextField-SJfhDDvQ.js";import"./Select-D7XYnLRf.js";import"./index-DnL3XN75.js";import"./Popover-B0QqOIFJ.js";import"./Modal-O3HFvYR5.js";import"./Portal-DOTL7Yad.js";import"./List-PtSETj5l.js";import"./ListContext-C4_dHRNu.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-33OhtJEr.js";import"./FormLabel-Df8u9uma.js";import"./InputLabel-DSc4Qx10.js";import"./ListItem-CNHhXRSS.js";import"./ListItemIcon-BkHLCJmT.js";import"./ListItemText-CaGb_JPi.js";import"./Remove-BruI8869.js";import"./useCopyToClipboard-BoyifASt.js";import"./Button-Bqv3NR6y.js";import"./Divider-rqAQKIY3.js";import"./FormControlLabel-CSId30ag.js";import"./Checkbox-BVkliRD-.js";import"./SwitchBase-BVxutwRW.js";import"./RadioGroup-BgE1AXxq.js";import"./MenuItem-CtKi2Sct.js";import"./translation-BFae--kF.js";import"./DialogTitle-DEXlHuyv.js";import"./Backdrop-PRNJOzON.js";import"./Tooltip-CCBqo9iV.js";import"./Popper-rfLbfelh.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-55apqFe8.js";import"./Edit-jublhnLz.js";import"./Cancel-CqxmePT9.js";import"./Progress-BtVD4y6Y.js";import"./LinearProgress-DtHPHgMh.js";import"./ContentHeader-bzYQI-XN.js";import"./Helmet-Ctffpokv.js";import"./ErrorBoundary-Dn7kNKcq.js";import"./ErrorPanel-B33pLPVR.js";import"./WarningPanel-DQn25WOa.js";import"./ExpandMore-CSLlRCsy.js";import"./AccordionDetails-BnUWlxaJ.js";import"./Collapse-DtNym6qB.js";import"./MarkdownContent-BXxoLhhS.js";import"./CodeSnippet-CItDkStU.js";import"./CopyTextButton-BSjmWnC0.js";import"./LinkButton-rg2HdNk0.js";import"./Link-CMkKbcZq.js";import"./useElementFilter-5JWb7JDj.js";import"./InfoCard-CZWzg546.js";import"./CardContent-BwUEUqdM.js";import"./CardHeader-Cc8WUsGZ.js";import"./CardActions-DQw2Z0X8.js";import"./BottomLink--V4SW3M9.js";import"./ArrowForward-CdPzQ0qE.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
