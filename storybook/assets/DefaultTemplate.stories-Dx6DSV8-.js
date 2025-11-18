import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-BJLAQiny.js";import{s as g,H as u}from"./plugin-DdYoI9xx.js";import{c as h}from"./api-Nw2e3ZdR.js";import{c as f}from"./catalogApiMock-ohP6dS8R.js";import{s as x}from"./api-DTqee4sT.js";import{S as y}from"./SearchContext-BCvQx2VI.js";import{P as S}from"./Page-D9t9GkKw.js";import{S as r}from"./Grid-85KaXqj6.js";import{b as k,a as j,c as C}from"./plugin-B5ZLJ7gh.js";import{T as P}from"./TemplateBackstageLogo-DL4dA9oW.js";import{T}from"./TemplateBackstageLogoIcon-DoOjaZZ5.js";import{e as I}from"./routes-BX-MuSSr.js";import{w as v}from"./appWrappers-Ch3ZwAuI.js";import{s as G}from"./StarredEntitiesApi-DEqcsHKE.js";import{M as A}from"./MockStarredEntitiesApi-B5O3hYnW.js";import{I as B}from"./InfoCard-yPFTnu1Z.js";import"./preload-helper-D9Z9MdNV.js";import"./index-BSxJtKs0.js";import"./Plugin-CG7_4OWW.js";import"./componentData-Bg3JyZcy.js";import"./useAnalytics-W203HJ0-.js";import"./useApp-BTkCnRE2.js";import"./useRouteRef-CVo3EImE.js";import"./index-bnZRQeHC.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-D_PwxK1T.js";import"./useMountedState-DW1n1H5-.js";import"./DialogTitle-BYsWp0dH.js";import"./Modal-98ZwNGha.js";import"./Portal-B2YIacrT.js";import"./Backdrop-BKPXV1ri.js";import"./Button-CtgRUIFg.js";import"./useObservable-DxZEzPKu.js";import"./useIsomorphicLayoutEffect-YDmtHS5G.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-C84WVsF3.js";import"./ErrorBoundary-iG0FMg2_.js";import"./ErrorPanel-C7O53zca.js";import"./WarningPanel-Cx0u9N3G.js";import"./ExpandMore-C9SKMfwh.js";import"./AccordionDetails-BeK8TLKU.js";import"./index-DnL3XN75.js";import"./Collapse-Dyo3yIeQ.js";import"./MarkdownContent-C9K6rk9j.js";import"./CodeSnippet-BCiMU4qs.js";import"./Box-DBjVidWA.js";import"./styled-Dbum34QX.js";import"./CopyTextButton-qCRVuup2.js";import"./useCopyToClipboard-WIY93EcD.js";import"./Tooltip-DWt_B2xO.js";import"./Popper-DQtSbLkc.js";import"./List-DMFoD1Fa.js";import"./ListContext-HC4v7bkz.js";import"./ListItem-Ccj_bLuX.js";import"./ListItemText-B0trVnJh.js";import"./LinkButton-B7rqQyTO.js";import"./Link-BsQxZTCc.js";import"./CardHeader-DOZJLl26.js";import"./Divider-DsKh9GaH.js";import"./CardActions-Cs4T3KjN.js";import"./BottomLink-Wm-pDfIj.js";import"./ArrowForward-Ds6zgypX.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
