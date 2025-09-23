import{j as t,T as i,c as m,C as a}from"./iframe-Ca7Z-L4G.js";import{w as n}from"./appWrappers-DRvX8LbQ.js";import{s as p,H as s}from"./plugin-DYkQUOKn.js";import{c as d}from"./api-Cxi0ldWv.js";import{c}from"./catalogApiMock-DBwitU1H.js";import{M as g}from"./MockStarredEntitiesApi-DCM6fzS6.js";import{s as l}from"./api-DI73kWJB.js";import{C as h}from"./CustomHomepageGrid-DhgKzvJX.js";import{H as f,a as u}from"./plugin-BeYxo7k0.js";import{e as y}from"./routes-uqfuuMBR.js";import{s as w}from"./StarredEntitiesApi-DjcHR_Am.js";import"./preload-helper-D9Z9MdNV.js";import"./useObservable-DntrMzpR.js";import"./useIsomorphicLayoutEffect-C-EeS4cl.js";import"./useAnalytics-B4tVP_DV.js";import"./useAsync-DSkJAg62.js";import"./useMountedState-CV_rLf93.js";import"./componentData-_1Qfjr2u.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./index-BJKCiffA.js";import"./useApp-CAw2wdK9.js";import"./index-D5Wi8gI-.js";import"./Plugin-C1QQDTm-.js";import"./useRouteRef-DDQzGExo.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./get-DGlRtlW4.js";import"./_baseSlice-DkFNCYmM.js";import"./_arrayReduce-BTs_qt-z.js";import"./toNumber-DwNnq1eP.js";import"./Add-DuxMbCsB.js";import"./Grid-auHuq8r2.js";import"./Box-BAIj98gt.js";import"./styled-C18e2gIS.js";import"./TextField-V411MSV4.js";import"./Select-DxKKxtIl.js";import"./index-DnL3XN75.js";import"./Popover-CcKmVttI.js";import"./Modal-DgmZg7sP.js";import"./Portal-BioI0xEQ.js";import"./List-CZA5eH2K.js";import"./ListContext-B_Im9Dn6.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-C-Q8lpQF.js";import"./FormLabel-qc-IFA2K.js";import"./InputLabel-C2usU0pq.js";import"./ListItem-C9nJC85u.js";import"./ListItemIcon-BNgxXteL.js";import"./ListItemText-DZSn-Gas.js";import"./Remove-pgTKGfhQ.js";import"./useCopyToClipboard-vqdrk62a.js";import"./Button-C4GDJaSU.js";import"./Divider-zG-YiM3h.js";import"./FormControlLabel-DYrl8oWP.js";import"./Checkbox-CFOiu_oi.js";import"./SwitchBase-43sqdZDc.js";import"./RadioGroup-CqIT35xU.js";import"./MenuItem-DT4YPicg.js";import"./translation-C98pHRI0.js";import"./DialogTitle-CdHDbEvu.js";import"./Backdrop-DXmAjQVD.js";import"./Tooltip-BxH5cU7h.js";import"./Popper-BHTXlPRY.js";import"./createStyles-Bp4GwXob.js";import"./createStyles-yD3y8ldD.js";import"./ListItemAvatar-N7UdIQ0-.js";import"./Edit-W1Gf7cPk.js";import"./Cancel-BGGSqFes.js";import"./Progress-D9_N7f9f.js";import"./LinearProgress-C7VwhN_u.js";import"./ContentHeader-pnIbOhqW.js";import"./Helmet-BG9Am0Tv.js";import"./ErrorBoundary-DMJmqIzN.js";import"./ErrorPanel-zLmvMY6B.js";import"./WarningPanel-DU1kckLo.js";import"./ExpandMore-CMMWGbBw.js";import"./AccordionDetails-CcpJ8mhZ.js";import"./Collapse-n2Kb8itc.js";import"./MarkdownContent-CoRCbhDs.js";import"./CodeSnippet-BKse1xIH.js";import"./CopyTextButton-DcJl0ww3.js";import"./LinkButton-BKXHaC2U.js";import"./Link-D6f9g5gT.js";import"./useElementFilter-BWOfhaQF.js";import"./InfoCard-6yqF4ElN.js";import"./CardContent-BzSwagcs.js";import"./CardHeader-C6vdyhr0.js";import"./CardActions-DoALoamq.js";import"./BottomLink-By8FPf_G.js";import"./ArrowForward-DUXpUVfv.js";const x=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],k=c({entities:x}),o=new g;o.toggleStarred("component:default/example-starred-entity");o.toggleStarred("component:default/example-starred-entity-2");o.toggleStarred("component:default/example-starred-entity-3");o.toggleStarred("component:default/example-starred-entity-4");const me={title:"Plugins/Home/Templates",decorators:[r=>n(t.jsx(t.Fragment,{children:t.jsx(i,{apis:[[d,k],[w,o],[l,{query:()=>Promise.resolve({results:[]})}],[m,new a({backend:{baseUrl:"https://localhost:7007"}})]],children:t.jsx(r,{})})}),{mountedRoutes:{"/hello-company":p.routes.root,"/catalog/:namespace/:kind/:name":y}})]},e=()=>{const r=[{component:"HomePageSearchBar",x:0,y:0,width:12,height:5},{component:"HomePageRandomJoke",x:0,y:2,width:6,height:16},{component:"HomePageStarredEntities",x:6,y:2,width:6,height:12}];return t.jsxs(h,{config:r,rowHeight:10,children:["// Insert the allowed widgets inside the grid. User can add, organize and // remove the widgets as they want.",t.jsx(s,{}),t.jsx(f,{}),t.jsx(u,{})]})};e.__docgenInfo={description:"",methods:[],displayName:"CustomizableTemplate"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
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
