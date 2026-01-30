import{j as t,U as i,V as m,W as a}from"./iframe-CJaWlx9k.js";import{s as n,H as p}from"./plugin-CB5XIHom.js";import{c as s}from"./api-atHlAjLX.js";import{c as d}from"./catalogApiMock-wVjvbFI-.js";import{M as c}from"./MockStarredEntitiesApi-C_c9KR6d.js";import{s as g}from"./api-B2GOuMSA.js";import{C as l}from"./CustomHomepageGrid-Z7RhHMw3.js";import{H as h,a as f}from"./plugin-HC6L5CqT.js";import{e as u}from"./routes-CxQwpNa_.js";import{w as y}from"./appWrappers-KXpf8wG0.js";import{s as w}from"./StarredEntitiesApi-CITPCDyJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B0cKtLFQ.js";import"./Plugin-CYNhPwzU.js";import"./componentData-DJazsba3.js";import"./useAnalytics-B9VoDArS.js";import"./useApp-C3Rn7vNb.js";import"./useRouteRef-DSloxSH6.js";import"./index-BQ0Bm2RY.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useObservable-Ci9nj0uo.js";import"./useIsomorphicLayoutEffect-DaQ9vgb_.js";import"./isObject--vsEa_js.js";import"./isSymbol-DYihM2bc.js";import"./toString-jlmj72dF.js";import"./Add-BgghdNg2.js";import"./Grid-CvrlVjPi.js";import"./Box-C7QC6pzn.js";import"./styled-CZ7JF9wM.js";import"./TextField-DoeMvY-N.js";import"./Select-DDdsjrAg.js";import"./index-B9sM2jn7.js";import"./Popover-4AFqMLPU.js";import"./Modal-DA7gw75D.js";import"./Portal-CCaSbatU.js";import"./List-CG61H5Q6.js";import"./ListContext-BgC5EWvT.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-QuigaWzh.js";import"./FormLabel-BEqYHiJN.js";import"./InputLabel-DMp1RElY.js";import"./ListItem-C89Oh5hh.js";import"./ListItemIcon-BmFNtgXW.js";import"./ListItemText-DiADD6kG.js";import"./Remove-C8SrtvJi.js";import"./useCopyToClipboard-D8QOZa6n.js";import"./useMountedState-BX2n2ffy.js";import"./Button-BIo1VJpq.js";import"./Divider-iZOmm7wk.js";import"./FormControlLabel-MS6z0XmP.js";import"./Checkbox-B4BwPUU4.js";import"./SwitchBase-k0EZwJ-6.js";import"./RadioGroup-CuGfYwNw.js";import"./MenuItem-BUbXv8-4.js";import"./translation-CNGjPPFK.js";import"./DialogTitle-Ddd7NJfh.js";import"./Backdrop-Br04yFLt.js";import"./Tooltip-BdyP1fjK.js";import"./Popper-D3Zb46nS.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-xHxEYwuW.js";import"./Edit-Dmv420Fg.js";import"./Cancel-C66-dP0x.js";import"./Progress-BXhITX5m.js";import"./LinearProgress-C95mcMVy.js";import"./ContentHeader-CIEY88Bk.js";import"./Helmet-CWBM4u8z.js";import"./ErrorBoundary-Tzl3QUgw.js";import"./ErrorPanel-B3gEy6QN.js";import"./WarningPanel-Bt3VBM0r.js";import"./ExpandMore-C8_7pfNC.js";import"./AccordionDetails-rBd-wslk.js";import"./Collapse-Do9YA9sk.js";import"./MarkdownContent-BbMUo3g_.js";import"./CodeSnippet-7H2Sad9p.js";import"./CopyTextButton-BT4ENnB_.js";import"./LinkButton-5bxMHofQ.js";import"./Link-BT9-PDsb.js";import"./useElementFilter-DSV6Qoiw.js";import"./InfoCard-Dwr3nloC.js";import"./CardContent-Cz50hYBX.js";import"./CardHeader-C3-hJvDl.js";import"./CardActions-BgceOLG0.js";import"./BottomLink-Dm0y6uih.js";import"./ArrowForward-DYtCoeK4.js";import"./useAsync-BIkYo0dn.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=d({entities:x}),o=new c;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>y(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[s,k],[w,o],[g,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":n.routes.root,"/catalog/:namespace/:kind/:name":u}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(l,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(p,{}),t.jsx(h,{}),t.jsx(f,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
