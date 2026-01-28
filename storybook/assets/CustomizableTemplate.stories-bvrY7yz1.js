import{j as t,T as i,c as m,C as a}from"./iframe-Bnzrr9GJ.js";import{w as n}from"./appWrappers-VyQoo8wK.js";import{s as p,H as s}from"./plugin-DQnKwhQR.js";import{c as d}from"./api-CKgawEQD.js";import{c}from"./catalogApiMock-BzgbAzL6.js";import{M as g}from"./MockStarredEntitiesApi-5fLEhmFo.js";import{s as l}from"./api-ACo5GBlt.js";import{C as h}from"./CustomHomepageGrid-gxBANgkt.js";import{H as f,a as u}from"./plugin-DML38mmW.js";import{e as y}from"./routes-Bla2USqD.js";import{s as w}from"./StarredEntitiesApi-D0-pOJXV.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-DuLbtCIZ.js";import"./useIsomorphicLayoutEffect-BBA0B-Gu.js";import"./useAnalytics-0uTDec9U.js";import"./useAsync-Cf2YmW8g.js";import"./useMountedState-BCp4s1hj.js";import"./componentData-q9jR-RmB.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CYC8aWCi.js";import"./useApp-SixTcc6z.js";import"./index-DjdzPMHD.js";import"./Plugin-D_YG91mq.js";import"./useRouteRef-BIDrbivK.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./Add-6JwmA5WO.js";import"./Grid-yfENroGK.js";import"./Box-_ldnD672.js";import"./styled-ECwvL4gF.js";import"./TextField-DIBUfS0U.js";import"./Select-8SA9OREF.js";import"./index-B9sM2jn7.js";import"./Popover-Quj_W4ar.js";import"./Modal-C9035a_p.js";import"./Portal-7sPWK5aa.js";import"./List-C5zGpaSP.js";import"./ListContext-BS9Mebja.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-dzhrq95X.js";import"./FormLabel-DZfT6ehy.js";import"./InputLabel-AL9u2pG0.js";import"./ListItem-WNmrdDGe.js";import"./ListItemIcon-BpTUVwby.js";import"./ListItemText-CaCse6tD.js";import"./Remove-Dnyi2KuC.js";import"./useCopyToClipboard-C1DHvlyv.js";import"./Button-C4wuUHK5.js";import"./Divider-Dygs3iK7.js";import"./FormControlLabel-T4XoIVU4.js";import"./Checkbox-cAdterB2.js";import"./SwitchBase-DxtHsf8O.js";import"./RadioGroup-B4lyyOe5.js";import"./MenuItem-BEacitvl.js";import"./translation-Bm27K8nS.js";import"./DialogTitle-B57sbJyb.js";import"./Backdrop-U11n_nYY.js";import"./Tooltip-BNoXxCwH.js";import"./Popper-xM2ICnpy.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-DsInlSUo.js";import"./Edit-7dSw2Pof.js";import"./Cancel-DDB3PCk6.js";import"./Progress-CGF7s-wv.js";import"./LinearProgress-CTS_7g3N.js";import"./ContentHeader-BeST9efZ.js";import"./Helmet-1dUogHcC.js";import"./ErrorBoundary-DFuYykN9.js";import"./ErrorPanel-CD5X405H.js";import"./WarningPanel-CiGAMcSc.js";import"./ExpandMore-lB9NR-kr.js";import"./AccordionDetails-CuEuFzda.js";import"./Collapse-Bk6-UMMi.js";import"./MarkdownContent-uyUP_FU2.js";import"./CodeSnippet-CNEmId6n.js";import"./CopyTextButton-h_AlfJlB.js";import"./LinkButton-C4SkPNpD.js";import"./Link-B2CkVKPO.js";import"./useElementFilter-C-vR8PKJ.js";import"./InfoCard-B2jLnxg1.js";import"./CardContent-CQJGZ3r6.js";import"./CardHeader-D0WzuIfd.js";import"./CardActions-BwdKTwvs.js";import"./BottomLink-BBfeMbVs.js";import"./ArrowForward-KRJIM6Q4.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
