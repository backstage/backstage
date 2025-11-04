import{j as t,T as i,c as m,C as a}from"./iframe-BFEEYdl1.js";import{w as n}from"./appWrappers-Drr8kDaZ.js";import{s as p,H as s}from"./plugin-COvH9GCz.js";import{c as d}from"./api-BXvcrOVy.js";import{c}from"./catalogApiMock-CNKIenRE.js";import{M as g}from"./MockStarredEntitiesApi-7LA6DjNd.js";import{s as l}from"./api-DIzRtX_C.js";import{C as h}from"./CustomHomepageGrid-Bzu1jIil.js";import{H as f,a as u}from"./plugin-DKiRlTDL.js";import{e as y}from"./routes-Hzt0uvEG.js";import{s as w}from"./StarredEntitiesApi-DOAUIFbX.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-Dslwl8zx.js";import"./useIsomorphicLayoutEffect-C3Jz8w3d.js";import"./useAnalytics-RL6zQB6E.js";import"./useAsync-CK6ps4Gs.js";import"./useMountedState-SzYJvnyY.js";import"./componentData-fXGhNbVj.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-DFzOTOJF.js";import"./useApp-BQvOBI0y.js";import"./index-DwWrsyLS.js";import"./Plugin-EFweYiy3.js";import"./useRouteRef-Djz7qv6Y.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-Dsaj1oou.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-BSCjosDj.js";import"./Grid-_pxMEZfk.js";import"./Box-CcBhJ2N1.js";import"./styled-CQi9RfH7.js";import"./TextField-BAyv-RD7.js";import"./Select-Djy5U4Y0.js";import"./index-DnL3XN75.js";import"./Popover-D3pRgrSn.js";import"./Modal-DNwlsaiG.js";import"./Portal-CS1cCsNf.js";import"./List-Cp6nHQli.js";import"./ListContext-aQ8EEV7a.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-D7buIhaH.js";import"./FormLabel-Bhr5Y1VW.js";import"./InputLabel-Dw7t2-kZ.js";import"./ListItem-CoJRgtBh.js";import"./ListItemIcon-U0WBQXQ5.js";import"./ListItemText-B34yPKAV.js";import"./Remove-dpsF26_a.js";import"./useCopyToClipboard-CNm0_dns.js";import"./Button-Ci5q7ey2.js";import"./Divider-CYSzQ_1E.js";import"./FormControlLabel-D_LC5u_v.js";import"./Checkbox-C3PFc-vX.js";import"./SwitchBase-5_vTvZ2x.js";import"./RadioGroup-Bs8lCcPo.js";import"./MenuItem-C_MJVaC1.js";import"./translation-B5GjOEgV.js";import"./DialogTitle-C53FTZ8W.js";import"./Backdrop-Cc0uQTMy.js";import"./Tooltip-C4KvLgJb.js";import"./Popper-CQXdAewh.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-BZGEGqfr.js";import"./Edit-VmX5v1BN.js";import"./Cancel-BhI4Rj36.js";import"./Progress-Ca5iKXSZ.js";import"./LinearProgress-BCucwmQ2.js";import"./ContentHeader-CKY3foSk.js";import"./Helmet-BdGZzRpE.js";import"./ErrorBoundary-BrFvpfH8.js";import"./ErrorPanel-ByBjA_Oh.js";import"./WarningPanel-Ca_owezB.js";import"./ExpandMore-Ctn3qfGH.js";import"./AccordionDetails-BWiYd2nY.js";import"./Collapse-DQjjdB13.js";import"./MarkdownContent-BVMx6-i7.js";import"./CodeSnippet-DKeVSYKZ.js";import"./CopyTextButton-CPUbqQk2.js";import"./LinkButton-CtAJOX-o.js";import"./Link-BzkurKFl.js";import"./useElementFilter-DqBkgqgf.js";import"./InfoCard-BJpJ1bY7.js";import"./CardContent-C0IdQT8E.js";import"./CardHeader-aKIXN66o.js";import"./CardActions-BCgG5ICW.js";import"./BottomLink-Z_9FJnlR.js";import"./ArrowForward-CQW_bFSW.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
