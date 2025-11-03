import{j as t,T as i,c as m,C as a}from"./iframe-BpNetfkk.js";import{w as n}from"./appWrappers-BOa7ROWw.js";import{s as p,H as s}from"./plugin-DKV9oNjl.js";import{c as d}from"./api-Dq7vqIPY.js";import{c}from"./catalogApiMock-4RKKURNx.js";import{M as g}from"./MockStarredEntitiesApi-D4tUyrJ_.js";import{s as l}from"./api-BdOdcRRd.js";import{C as h}from"./CustomHomepageGrid-DzUSBHiV.js";import{H as f,a as u}from"./plugin-DBnmytZR.js";import{e as y}from"./routes-BIj-XfvM.js";import{s as w}from"./StarredEntitiesApi-D7R1xg4O.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-DGWPdt_D.js";import"./useIsomorphicLayoutEffect-CWGQpdG-.js";import"./useAnalytics-BKPjjI-y.js";import"./useAsync-BEoRug7E.js";import"./useMountedState-ya7tp212.js";import"./componentData-DzI36JOr.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-DgvPNMU4.js";import"./useApp-BAlbHaS5.js";import"./index-CnTzRFsp.js";import"./Plugin-C7nO-Ahz.js";import"./useRouteRef-xryfITRq.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-DQfAUBq4.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-BWtuqjEa.js";import"./Grid-DGDU_W7d.js";import"./Box-JPQ-K-XF.js";import"./styled-BVnjfZaP.js";import"./TextField-CM9PjYSi.js";import"./Select-Bk_6znan.js";import"./index-DnL3XN75.js";import"./Popover-C0hTF1EH.js";import"./Modal-CJXuzFvx.js";import"./Portal-D3MaVJdo.js";import"./List-CcdBBh0x.js";import"./ListContext-BkpiPoXc.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-p1mzlkeq.js";import"./FormLabel-HI5ElYjJ.js";import"./InputLabel-CnhDo5aY.js";import"./ListItem-BE6uqYrF.js";import"./ListItemIcon-CdIWE3bw.js";import"./ListItemText-7Fv6oNRR.js";import"./Remove-DtRWxNqP.js";import"./useCopyToClipboard-B1BfXZ6A.js";import"./Button-D2OH5WH0.js";import"./Divider-2QoBmfwj.js";import"./FormControlLabel-DWAXrb7R.js";import"./Checkbox-CAwi0hQQ.js";import"./SwitchBase-qYG6LXgU.js";import"./RadioGroup-D-oSPjy-.js";import"./MenuItem-C2NdwYGU.js";import"./translation-C0aifPk9.js";import"./DialogTitle-E_A2_fbu.js";import"./Backdrop-DCl54FLG.js";import"./Tooltip-DuxoX6f6.js";import"./Popper-Bfi8Jp6K.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-Cd2MTd2Y.js";import"./Edit-BL8e43P7.js";import"./Cancel-DFUzz7YI.js";import"./Progress-aE01bH1X.js";import"./LinearProgress-DZ8ZrlNO.js";import"./ContentHeader-nhWAjtw9.js";import"./Helmet-DyCSvoDs.js";import"./ErrorBoundary-x8IJumU0.js";import"./ErrorPanel-C-auWv_U.js";import"./WarningPanel-BZPI4iuJ.js";import"./ExpandMore-Dg48zgbf.js";import"./AccordionDetails-CXV1bjLg.js";import"./Collapse-CFskqauo.js";import"./MarkdownContent-lOphwaGa.js";import"./CodeSnippet-BiIQ6QnU.js";import"./CopyTextButton-D74HsvCl.js";import"./LinkButton-CzXWMwoD.js";import"./Link-Bbtl6_jS.js";import"./useElementFilter-So0OUJh9.js";import"./InfoCard-B2lpfx9C.js";import"./CardContent-B2DNk4YF.js";import"./CardHeader-BzLrPpse.js";import"./CardActions-B_KvZC1G.js";import"./BottomLink-xNQE9YQZ.js";import"./ArrowForward-DwUrP4PQ.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
