import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-C8ExrwzU.js";import{s as g,H as u}from"./plugin-Bj8NWHpe.js";import{c as h}from"./api-C7Oojffb.js";import{c as f}from"./catalogApiMock-BFDjK0lp.js";import{s as x}from"./api-C-n-MJyU.js";import{S as y}from"./SearchContext-jRC61WGz.js";import{P as S}from"./Page-axKtgc5c.js";import{S as r}from"./Grid-DspeJWIy.js";import{b as k,a as j,c as C}from"./plugin-Cege8qGM.js";import{T as P}from"./TemplateBackstageLogo-CKHnC1aT.js";import{T}from"./TemplateBackstageLogoIcon-DIyiGPTy.js";import{e as I}from"./routes-DJ4jugAK.js";import{w as v}from"./appWrappers-BaMznTf3.js";import{s as G}from"./StarredEntitiesApi-xhtvRoUY.js";import{M as A}from"./MockStarredEntitiesApi-CdOr-cND.js";import{I as B}from"./InfoCard-D_4zmvid.js";import"./preload-helper-D9Z9MdNV.js";import"./index-ldVdSwr-.js";import"./Plugin-B2v-vDzx.js";import"./componentData-Dj-cJqs3.js";import"./useAnalytics-BlYc1avD.js";import"./useApp-C7pfrKGm.js";import"./useRouteRef-C6pJYPst.js";import"./index-BgOC1FTX.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-DwtigoPq.js";import"./useMountedState-UCRwgIDM.js";import"./DialogTitle-B89siiWU.js";import"./Modal-DbOcvVvU.js";import"./Portal-BvPm8y4I.js";import"./Backdrop-86Drsiia.js";import"./Button-BirFLWZh.js";import"./useObservable-D53Q4Zoo.js";import"./useIsomorphicLayoutEffect-CxciEqLm.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-BgCJnSoO.js";import"./ErrorBoundary-F_hBtf1o.js";import"./ErrorPanel-CDFCJhtV.js";import"./WarningPanel-CfgTJdNP.js";import"./ExpandMore-CE-AlmPZ.js";import"./AccordionDetails-CKE4MG-J.js";import"./index-DnL3XN75.js";import"./Collapse-DuUvJIAd.js";import"./MarkdownContent-CQVlpVaR.js";import"./CodeSnippet-BRYqmlwq.js";import"./Box-DKI1NtYF.js";import"./styled-BZchgpfg.js";import"./CopyTextButton-CfcOHHdO.js";import"./useCopyToClipboard-CrQaQuzV.js";import"./Tooltip-rFR9MD6z.js";import"./Popper-BQ20DEXn.js";import"./List-D4oyelOm.js";import"./ListContext-D23aAr-N.js";import"./ListItem-DGmfxxZu.js";import"./ListItemText-CIKs-KSS.js";import"./LinkButton-DxVeoCL2.js";import"./Link-D0uGQ-EQ.js";import"./CardHeader-BB7CXK1i.js";import"./Divider-4xHmk1Qy.js";import"./CardActions-BOmf1H7g.js";import"./BottomLink-DMese3Ls.js";import"./ArrowForward-Dcuc9hR9.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
