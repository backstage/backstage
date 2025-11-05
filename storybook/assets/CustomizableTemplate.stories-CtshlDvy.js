import{j as t,T as i,c as m,C as a}from"./iframe-CjPeRtpr.js";import{w as n}from"./appWrappers-C7xvnveN.js";import{s as p,H as s}from"./plugin-q9q1rT_r.js";import{c as d}from"./api-Dhj__NXZ.js";import{c}from"./catalogApiMock-tq330N5J.js";import{M as g}from"./MockStarredEntitiesApi-YlbRu7Hm.js";import{s as l}from"./api-D0Qp0-Td.js";import{C as h}from"./CustomHomepageGrid-D7M04Wtf.js";import{H as f,a as u}from"./plugin-BFKPDosn.js";import{e as y}from"./routes-T1nZyzWC.js";import{s as w}from"./StarredEntitiesApi-CCISyMOh.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-BgsOv5AO.js";import"./useIsomorphicLayoutEffect-DOJbEOhC.js";import"./useAnalytics-CKVjVoDQ.js";import"./useAsync-D_X77wsO.js";import"./useMountedState-_t540rGO.js";import"./componentData-BESRmA5Y.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-o3KEuSlS.js";import"./useApp-BDYwb5CO.js";import"./index-Bs5sAiYh.js";import"./Plugin-By9pZykQ.js";import"./useRouteRef-aNZDBX5J.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-RqM6iwIj.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-DiWt_G8v.js";import"./Grid-C-Nq5_yH.js";import"./Box-Clo5S76h.js";import"./styled-HkKxam_j.js";import"./TextField-D66ohS81.js";import"./Select-C9pSJE1i.js";import"./index-DnL3XN75.js";import"./Popover-CtBABBeq.js";import"./Modal-CJx3g85d.js";import"./Portal-DbRgE8W4.js";import"./List-viPECRg_.js";import"./ListContext-B6QifY9s.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Dh_K_syj.js";import"./FormLabel-CED2Jl1P.js";import"./InputLabel-BT31BMNY.js";import"./ListItem-DXifIexk.js";import"./ListItemIcon-BCG-2iZm.js";import"./ListItemText-DslgGDwr.js";import"./Remove-DDMedeRD.js";import"./useCopyToClipboard-Cab7YRdZ.js";import"./Button-BBexx9Xc.js";import"./Divider-CTYbgud9.js";import"./FormControlLabel-8d_8Zt1g.js";import"./Checkbox-2qZb2xXX.js";import"./SwitchBase-E28p-qiK.js";import"./RadioGroup-CqS-8S3Z.js";import"./MenuItem-IieluMYu.js";import"./translation--WgqT3fQ.js";import"./DialogTitle-BwKasQ9h.js";import"./Backdrop-BucF1-y1.js";import"./Tooltip-D2MzRiUK.js";import"./Popper-Daug_pz5.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-DJtH3qUP.js";import"./Edit-154PZ7dB.js";import"./Cancel-BYqXt5hn.js";import"./Progress-BQZXfCmC.js";import"./LinearProgress-CQOliNIP.js";import"./ContentHeader-D-Ln4WZR.js";import"./Helmet-BmGvJBW2.js";import"./ErrorBoundary-BhQ1akLk.js";import"./ErrorPanel-By3NRS2J.js";import"./WarningPanel-qGQeTBaX.js";import"./ExpandMore-Cc9LWRDz.js";import"./AccordionDetails-DEzX30Kp.js";import"./Collapse-CKqt3vm7.js";import"./MarkdownContent-B1Y4fp3A.js";import"./CodeSnippet-BmcxidKZ.js";import"./CopyTextButton-pFjOigu_.js";import"./LinkButton-Cj8Y8NY6.js";import"./Link-C_RbsuLk.js";import"./useElementFilter-CGkTlefc.js";import"./InfoCard-C-EjB3hx.js";import"./CardContent-CEOlXio4.js";import"./CardHeader-Dcsx-jhN.js";import"./CardActions-lfCrbJSj.js";import"./BottomLink-CulmZeTU.js";import"./ArrowForward-D3dovPjI.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
