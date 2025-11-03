import{j as t,T as i,c as m,C as a}from"./iframe-B1bS8kNu.js";import{w as n}from"./appWrappers-C65DRcJR.js";import{s as p,H as s}from"./plugin-Tb-NEX9-.js";import{c as d}from"./api-VpYWzsDq.js";import{c}from"./catalogApiMock-DXXw7Rcs.js";import{M as g}from"./MockStarredEntitiesApi-5xFaNxTp.js";import{s as l}from"./api-DdRYAeGK.js";import{C as h}from"./CustomHomepageGrid-NY5LQ67A.js";import{H as f,a as u}from"./plugin-9321bBmh.js";import{e as y}from"./routes-DylaiN7F.js";import{s as w}from"./StarredEntitiesApi-D4FvzfRE.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-BdE9m8Kk.js";import"./useIsomorphicLayoutEffect-B8jAT4vp.js";import"./useAnalytics-CWJQ4paP.js";import"./useAsync-DRwN7CqQ.js";import"./useMountedState-DehZQ_NE.js";import"./componentData-C-kspxhs.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-BB5XVHud.js";import"./useApp-DrlXjDDm.js";import"./index-B6_CRFg0.js";import"./Plugin-D0zUNDSW.js";import"./useRouteRef-DHlcXK6F.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-DjO7Xc5z.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-Cok19xQq.js";import"./Grid-C88sFnNl.js";import"./Box-kUekMc6O.js";import"./styled-CICePBTu.js";import"./TextField-BjbgRBOe.js";import"./Select-CVfkA-9d.js";import"./index-DnL3XN75.js";import"./Popover-cbtVu3bF.js";import"./Modal-DljuX6iF.js";import"./Portal-CbatMowK.js";import"./List-vAsLcuDY.js";import"./ListContext-Dr49CUeJ.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DaalzCaB.js";import"./FormLabel-DtaAPJK1.js";import"./InputLabel-CzH8LmN7.js";import"./ListItem-F3f87gTr.js";import"./ListItemIcon-DHaOHLlT.js";import"./ListItemText-CcMD6A8n.js";import"./Remove-BKLYToee.js";import"./useCopyToClipboard-DtkwdRTx.js";import"./Button-CgBkAUiP.js";import"./Divider-Bq5dRhO-.js";import"./FormControlLabel-C40Quv3u.js";import"./Checkbox-DqwWLYjE.js";import"./SwitchBase-HY5Riu8I.js";import"./RadioGroup-CM3HtTqK.js";import"./MenuItem-DG-GRKY3.js";import"./translation-C1DrWRWx.js";import"./DialogTitle-CGSxheNa.js";import"./Backdrop-DC3_0QFG.js";import"./Tooltip-CpvnZrMV.js";import"./Popper-DI0r4x2S.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BKDFl6sk.js";import"./Edit-CWEdvtz4.js";import"./Cancel-H5cJ7SUR.js";import"./Progress-BDGc4XZz.js";import"./LinearProgress-DfXpNOeO.js";import"./ContentHeader-C9bucN0D.js";import"./Helmet-Dq4v_l6d.js";import"./ErrorBoundary-Dg6qw5Z9.js";import"./ErrorPanel-DfQRlabN.js";import"./WarningPanel-Cb2ULWmf.js";import"./ExpandMore-Y-_AusZ_.js";import"./AccordionDetails-DjOY9uzz.js";import"./Collapse-BL8sH0TP.js";import"./MarkdownContent-B5j69JDg.js";import"./CodeSnippet-Cfe8KNVU.js";import"./CopyTextButton-amdB5IIQ.js";import"./LinkButton-BzTRIntM.js";import"./Link--XlSoX1z.js";import"./useElementFilter-CEj6SlLl.js";import"./InfoCard-DaVqc602.js";import"./CardContent-C2gGqaJ1.js";import"./CardHeader-XX7OP1Eg.js";import"./CardActions-DoU6wCz4.js";import"./BottomLink-4AtDZufv.js";import"./ArrowForward-CvuqPmlL.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
