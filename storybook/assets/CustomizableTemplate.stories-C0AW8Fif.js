import{j as t,T as i,c as m,C as a}from"./iframe-Ca4Oq2uP.js";import{w as n}from"./appWrappers-DhOSUPKL.js";import{s as p,H as s}from"./plugin-DNPqNNBT.js";import{c as d}from"./api-BuQPoYuz.js";import{c}from"./catalogApiMock-D3aClAIQ.js";import{M as g}from"./MockStarredEntitiesApi-BIWNIFvf.js";import{s as l}from"./api-Dcx0nsvn.js";import{C as h}from"./CustomHomepageGrid-Bq0IHr92.js";import{H as f,a as u}from"./plugin-DmM0PbHN.js";import{e as y}from"./routes-fyx70DKV.js";import{s as w}from"./StarredEntitiesApi-BE2ls2yP.js";import"./preload-helper-PPVm8Dsz.js";import"./useObservable-D5OlgkuN.js";import"./useIsomorphicLayoutEffect-D_xlHkKu.js";import"./useAnalytics-BO6qv_N6.js";import"./useAsync-DQa5qi3g.js";import"./useMountedState-am8g5938.js";import"./componentData-CRvdRyiq.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-CWD4-Z7Q.js";import"./useApp-CIEu2n9t.js";import"./index-Cw7rIkuX.js";import"./Plugin-Gf4U2wcG.js";import"./useRouteRef-BGRvnXy4.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./Add-CIkCjVAr.js";import"./Grid-DvRbNd4W.js";import"./Box-C6YthH4K.js";import"./styled-bS2mVuuT.js";import"./TextField-CTsH-oZJ.js";import"./Select-BbOGwYZT.js";import"./index-B9sM2jn7.js";import"./Popover-C2h9W_Jp.js";import"./Modal-DNybagJK.js";import"./Portal-DfnbqdYt.js";import"./List-_jXEyBxC.js";import"./ListContext-DFKFAB0C.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CN-8BnS9.js";import"./FormLabel-Zj9aN-y3.js";import"./InputLabel-BKLbZaDc.js";import"./ListItem-BrncrmWC.js";import"./ListItemIcon-DdMdcQLM.js";import"./ListItemText-VT7wc13t.js";import"./Remove-DzFEG144.js";import"./useCopyToClipboard-CrLUyXrt.js";import"./Button-lNm9l9il.js";import"./Divider-I0xPhLEa.js";import"./FormControlLabel-CiDWvfpt.js";import"./Checkbox-BlA4gZUM.js";import"./SwitchBase-CfRPubEc.js";import"./RadioGroup-CoKZVW7z.js";import"./MenuItem-mA5hVKuu.js";import"./translation-DxFFMJsK.js";import"./DialogTitle-DcpjkfLf.js";import"./Backdrop-B0S7DZUH.js";import"./Tooltip-DlFbz0wm.js";import"./Popper-D7At4psl.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-B2WJ7xSx.js";import"./Edit-nBJ1q2kj.js";import"./Cancel-BC7AYw-u.js";import"./Progress-rlY7Qd6Q.js";import"./LinearProgress-DgysqIr2.js";import"./ContentHeader-k4Om6ZU6.js";import"./Helmet-DoJDyaav.js";import"./ErrorBoundary-Do1MdOmP.js";import"./ErrorPanel-B9MZJL52.js";import"./WarningPanel-D_gQNl9J.js";import"./ExpandMore-BYyl-nAO.js";import"./AccordionDetails-C-jAEpJA.js";import"./Collapse-B_fsMJ0G.js";import"./MarkdownContent-CCSCaS3C.js";import"./CodeSnippet-BNIZNbBb.js";import"./CopyTextButton-CxyLRgr5.js";import"./LinkButton-C2Y4nle9.js";import"./Link-C9Yjpk8V.js";import"./useElementFilter-C0647VAd.js";import"./InfoCard-CTsToJIt.js";import"./CardContent-BhfeUuXc.js";import"./CardHeader-CP6xFFSM.js";import"./CardActions-EN8qOMz-.js";import"./BottomLink-CRrKsmqK.js";import"./ArrowForward-CTfGuzv6.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const ee={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
