import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-B07WZXM3.js";import{s as g,H as u}from"./plugin-bQkFmPGq.js";import{c as h}from"./api-DI0yvp5j.js";import{c as f}from"./catalogApiMock-C_CMiumw.js";import{s as x}from"./api-B64UmXKD.js";import{S as y}from"./SearchContext-DX1UMHve.js";import{P as S}from"./Page-CJhXbKJS.js";import{S as r}from"./Grid-BY5Lob_Q.js";import{b as k,a as j,c as C}from"./plugin-Cky38OIy.js";import{T as P}from"./TemplateBackstageLogo-0S3DHxDz.js";import{T}from"./TemplateBackstageLogoIcon-SH_dYuY-.js";import{e as I}from"./routes-Pvp219n7.js";import{w as v}from"./appWrappers-CY9OeE-D.js";import{s as G}from"./StarredEntitiesApi-KlmEdHwv.js";import{M as A}from"./MockStarredEntitiesApi-CWGjzr_c.js";import{I as B}from"./InfoCard-F0p-l5uK.js";import"./preload-helper-D9Z9MdNV.js";import"./index-D2gGq-iW.js";import"./Plugin-CZOVJjYF.js";import"./componentData-DQzB6vVe.js";import"./useAnalytics-CVMEzOss.js";import"./useApp-K3As38vi.js";import"./useRouteRef-YqSqr-8_.js";import"./index-BxkUEN8z.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-DCstABRD.js";import"./useMountedState-BHHklG7n.js";import"./DialogTitle-D75WnviF.js";import"./Modal-C4lsEVR2.js";import"./Portal-XA5rRvQB.js";import"./Backdrop-BhjMJ7cT.js";import"./Button-CyuaBLDC.js";import"./useObservable-BmNeYwoO.js";import"./useIsomorphicLayoutEffect-BK_xBPGN.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-Di1P8Mmg.js";import"./ErrorBoundary-C0cY3uRo.js";import"./ErrorPanel-ayETAGhj.js";import"./WarningPanel-DImNnyuV.js";import"./ExpandMore-Da5XW09b.js";import"./AccordionDetails-B-vBZmTY.js";import"./index-DnL3XN75.js";import"./Collapse-Bc-VFX1u.js";import"./MarkdownContent-CcNYv7l1.js";import"./CodeSnippet-BxcFip7J.js";import"./Box-BLhfQJZZ.js";import"./styled-DWF50Q3F.js";import"./CopyTextButton-xE5t_wDk.js";import"./useCopyToClipboard-2MhLRliJ.js";import"./Tooltip-CZw4hPcl.js";import"./Popper-DRLEgsx8.js";import"./List-NEqxYc-i.js";import"./ListContext-DoxtYS94.js";import"./ListItem-CbK_QR24.js";import"./ListItemText-BnYxYQrd.js";import"./LinkButton-C9NGk5Cj.js";import"./Link-BSdi_-Cv.js";import"./CardHeader-D4MCyAu5.js";import"./Divider-MyjmiSrT.js";import"./CardActions-DK9Pnp_M.js";import"./BottomLink-DRJDK7sA.js";import"./ArrowForward-C1CbMcYH.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
