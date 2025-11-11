import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-D1GFiJZo.js";import{s as g,H as u}from"./plugin-c1vXF8SX.js";import{c as h}from"./api-DmnGfimw.js";import{c as f}from"./catalogApiMock-DgAItH2H.js";import{s as x}from"./api-De_PjT1Y.js";import{S as y}from"./SearchContext-BXchyST7.js";import{P as S}from"./Page-CN6o8lMX.js";import{S as r}from"./Grid-C_DJ7CXy.js";import{b as k,a as j,c as C}from"./plugin-CKgXZTOa.js";import{T as P}from"./TemplateBackstageLogo-Eo5gry6B.js";import{T}from"./TemplateBackstageLogoIcon-C_U7H0hP.js";import{e as I}from"./routes-Q3Q6KnUW.js";import{w as v}from"./appWrappers-DsMAuWKH.js";import{s as G}from"./StarredEntitiesApi-D66mcyWw.js";import{M as A}from"./MockStarredEntitiesApi-KR7cj_pE.js";import{I as B}from"./InfoCard-DNXQeFaq.js";import"./preload-helper-D9Z9MdNV.js";import"./index-3az-8BBE.js";import"./Plugin-DzFxQMSf.js";import"./componentData-B3mVAfsp.js";import"./useAnalytics-CoSsSvYs.js";import"./useApp-DQ-5E_lb.js";import"./useRouteRef-DO_E-PIP.js";import"./index-DKQ8ROEi.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-B9mAtbAn.js";import"./useMountedState-qz1JMqOw.js";import"./DialogTitle-BrPPzfXC.js";import"./Modal-Cfmtm0OK.js";import"./Portal-B8zTs1MC.js";import"./Backdrop-ClAhZkYO.js";import"./Button-DZDIOJUc.js";import"./useObservable-mQQsnksj.js";import"./useIsomorphicLayoutEffect-C1EkHGJN.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-CDDk_fHy.js";import"./ErrorBoundary-BGnIfumD.js";import"./ErrorPanel-DW_UBsf7.js";import"./WarningPanel-Cp7h97Xz.js";import"./ExpandMore-C5Qt4VBZ.js";import"./AccordionDetails-CHtH84ap.js";import"./index-DnL3XN75.js";import"./Collapse-DDq3EAkH.js";import"./MarkdownContent-B_nTIlyA.js";import"./CodeSnippet-C5RtD8fm.js";import"./Box-_YREnRyM.js";import"./styled-CDUeIV7m.js";import"./CopyTextButton-p_Y8WBTg.js";import"./useCopyToClipboard-BYpPSSth.js";import"./Tooltip-hGuiE2Q3.js";import"./Popper-CVVnhvaK.js";import"./List-kH2EmDt_.js";import"./ListContext-BZJs2wbx.js";import"./ListItem-DWHRsh5J.js";import"./ListItemText-ioovX8R3.js";import"./LinkButton-CABNA6l3.js";import"./Link-B1KKwcLj.js";import"./CardHeader-HwFA-nax.js";import"./Divider-CCA28OD_.js";import"./CardActions-BH1q8i_s.js";import"./BottomLink-BFyTmqMM.js";import"./ArrowForward-DKYzAO2n.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
