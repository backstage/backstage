import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-DLxOzT4t.js";import{s as g,H as u}from"./plugin-6FpJEJVS.js";import{c as h}from"./api-7j1uRzms.js";import{c as f}from"./catalogApiMock-Xf_VhSk_.js";import{s as x}from"./api-DIB8lQ_j.js";import{S as y}from"./SearchContext-CO7ZwDUu.js";import{P as S}from"./Page-BNGV7Jqh.js";import{S as r}from"./Grid-DTcNMdF5.js";import{b as k,a as j,c as C}from"./plugin-D1Vsl5C_.js";import{T as P}from"./TemplateBackstageLogo-D_MHL4Lp.js";import{T}from"./TemplateBackstageLogoIcon-CKcA8xn-.js";import{e as I}from"./routes-DpNR4tak.js";import{w as v}from"./appWrappers-BgZnm0lF.js";import{s as G}from"./StarredEntitiesApi-BHNDUe5F.js";import{M as A}from"./MockStarredEntitiesApi-D5IIo2Tp.js";import{I as B}from"./InfoCard-BX_nQnVA.js";import"./preload-helper-D9Z9MdNV.js";import"./index-DAIM8wYU.js";import"./Plugin-D7Oiw_QY.js";import"./componentData-B5NpAqVg.js";import"./useAnalytics-iDMqp06i.js";import"./useApp-CkqCNNj_.js";import"./useRouteRef-HPNEm24O.js";import"./index-YuKWWjwW.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-CNKDNBbw.js";import"./useMountedState-DJ6mJaNE.js";import"./DialogTitle-Dn15pT6I.js";import"./Modal-7EqbtETg.js";import"./Portal-CdFb3as0.js";import"./Backdrop-D5lzsJdl.js";import"./Button-DWoU60bY.js";import"./useObservable-Bzw4Lu4i.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-Bj7b70Os.js";import"./ErrorBoundary-KnBb7wcL.js";import"./ErrorPanel-RMUJvBFr.js";import"./WarningPanel-Dc2tcH1q.js";import"./ExpandMore-K2fwTw0G.js";import"./AccordionDetails-DoLgEhQ2.js";import"./index-DnL3XN75.js";import"./Collapse-Dx6BQFCw.js";import"./MarkdownContent-C4aBi8UG.js";import"./CodeSnippet-Drl8Y1S9.js";import"./Box-BEY2IraA.js";import"./styled-C22knZjm.js";import"./CopyTextButton-B07LVSwl.js";import"./useCopyToClipboard-C72jLjo9.js";import"./Tooltip-CfLuXrUC.js";import"./Popper-DRx4nqXa.js";import"./List-D0oVWlo0.js";import"./ListContext-CoRXql5V.js";import"./ListItem-C0vbBd3c.js";import"./ListItemText-DNlkMNGC.js";import"./LinkButton-BJUAlKHF.js";import"./Link-CRIj9jSl.js";import"./CardHeader-DKM6gr3f.js";import"./Divider-CWCd2akK.js";import"./CardActions-C6azI5IY.js";import"./BottomLink-BLtQezSR.js";import"./ArrowForward-BRfxW2ea.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ut={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const Wt=["DefaultTemplate"];export{o as DefaultTemplate,Wt as __namedExportsOrder,Ut as default};
