import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-hd6BgcQH.js";import{s as g,H as u}from"./plugin-B56SQr8t.js";import{c as h}from"./api-DNqHLG7A.js";import{c as f}from"./catalogApiMock-B8JcgluX.js";import{s as x}from"./api-Bev5I2Sd.js";import{S as y}from"./SearchContext-BtDsvwkw.js";import{P as S}from"./Page-BWbDECR4.js";import{S as r}from"./Grid-C4Dm4yGa.js";import{b as k,a as j,c as C}from"./plugin-92FY2VfE.js";import{T as P}from"./TemplateBackstageLogo-BkUYWWAG.js";import{T}from"./TemplateBackstageLogoIcon-u-sWuj8x.js";import{e as I}from"./routes-DcA3o41U.js";import{w as v}from"./appWrappers-Ci8V8MLf.js";import{s as G}from"./StarredEntitiesApi-BgGec0Cc.js";import{M as A}from"./MockStarredEntitiesApi-DMc5kgRe.js";import{I as B}from"./InfoCard-DXQ7_Apb.js";import"./preload-helper-D9Z9MdNV.js";import"./index-B1O3cqUv.js";import"./Plugin-iM4X_t4D.js";import"./componentData-Cp5cye-b.js";import"./useAnalytics-BNw5WHP5.js";import"./useApp-D57mFECn.js";import"./useRouteRef-BFQKnc9G.js";import"./index-BvioCNb0.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-DlvFpJJJ.js";import"./useMountedState-BwuO-QSl.js";import"./DialogTitle-BJGjv1lD.js";import"./Modal-DC-l3nZj.js";import"./Portal-QtjodaYU.js";import"./Backdrop-TGnaLO6W.js";import"./Button-3MbgNa_D.js";import"./useObservable-C2Ift1hU.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-Da9FNRpD.js";import"./ErrorBoundary-BxDyxJNA.js";import"./ErrorPanel-pwFCh6zc.js";import"./WarningPanel-Le2tKfrN.js";import"./ExpandMore-C7-67hd9.js";import"./AccordionDetails-DosuP5Ed.js";import"./index-DnL3XN75.js";import"./Collapse-D-UdipB4.js";import"./MarkdownContent-aZlBpoZT.js";import"./CodeSnippet-BlQm8FHA.js";import"./Box-C4_Hx4tK.js";import"./styled-Csv0DLFw.js";import"./CopyTextButton-C8AIAO8L.js";import"./useCopyToClipboard-ZIjVTeCY.js";import"./Tooltip-DHFXXWJ1.js";import"./Popper-BLI_ywQx.js";import"./List-Eydl9qQR.js";import"./ListContext-DMV1tqqG.js";import"./ListItem-BuICECdF.js";import"./ListItemText-B0MXj_oA.js";import"./LinkButton-DUOFEHwI.js";import"./Link-DIsoXdRS.js";import"./CardHeader-ChJbkXh1.js";import"./Divider-BsrVsHFl.js";import"./CardActions-Ci4WOTdw.js";import"./BottomLink-BlsHV6Ti.js";import"./ArrowForward-Bdq2LjKG.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ut={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
