import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-CqNqnb74.js";import{s as g,H as u}from"./plugin-B4vq7brV.js";import{c as h}from"./api-EueqiTD3.js";import{c as f}from"./catalogApiMock-Cd43uM3Q.js";import{s as x}from"./api-CXOWMhx8.js";import{S as y}from"./SearchContext-P9AU12Mh.js";import{P as S}from"./Page-CNZ4fsiG.js";import{S as r}from"./Grid-Caq84KkR.js";import{b as k,a as j,c as C}from"./plugin-Xa30wQur.js";import{T as P}from"./TemplateBackstageLogo-CWirHFPW.js";import{T as I}from"./TemplateBackstageLogoIcon-apxC7KZE.js";import{e as T}from"./routes-InZJ6E5o.js";import{w as v}from"./appWrappers-C_psOORT.js";import{s as G}from"./StarredEntitiesApi-MoEicSjv.js";import{M as A}from"./MockStarredEntitiesApi-BaRt4bfW.js";import{I as B}from"./InfoCard-CG5avwIW.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BtY4FWww.js";import"./Plugin-DYku7kmG.js";import"./componentData-FAAyaxJE.js";import"./useAnalytics-BT9M_UlL.js";import"./useApp-IKd96EAr.js";import"./useRouteRef-C3TAPCF-.js";import"./index-CfXjUdjY.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-BA3GFE0D.js";import"./useMountedState-DTFeLOhk.js";import"./DialogTitle-CooOy-k1.js";import"./Modal-DG_DwVZd.js";import"./Portal-Czxz0PR0.js";import"./Backdrop-Bu5rdiX9.js";import"./Button-BIN6mxNu.js";import"./useObservable-BIXBQOil.js";import"./useIsomorphicLayoutEffect-BPmaJ8UY.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-Dm5YK7Lf.js";import"./ErrorBoundary-BxcDMcm2.js";import"./ErrorPanel-BYm0Mdkb.js";import"./WarningPanel-BCw9VL3x.js";import"./ExpandMore-CaaJdVfs.js";import"./AccordionDetails-DNjlLobr.js";import"./index-B9sM2jn7.js";import"./Collapse-D1DbSfAq.js";import"./MarkdownContent-CAUU14sj.js";import"./CodeSnippet-DP3MYkIR.js";import"./Box-BOvD5Bg7.js";import"./styled-_PBYdDbi.js";import"./CopyTextButton-DzB5MTRG.js";import"./useCopyToClipboard-D6T0fjGN.js";import"./Tooltip-DFfl-fad.js";import"./Popper-C4CcENfH.js";import"./List-aEU9IVP1.js";import"./ListContext-D4KOPpIf.js";import"./ListItem-CO20Ch0Y.js";import"./ListItemText-qCutXsPN.js";import"./LinkButton-FESOt-od.js";import"./Link-CAxa2nmx.js";import"./CardHeader-CmAP5YfK.js";import"./Divider-zsbty3yZ.js";import"./CardActions-CAm3b56u.js";import"./BottomLink-7YaXAONt.js";import"./ArrowForward-PIPGF8mw.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Ft as default};
