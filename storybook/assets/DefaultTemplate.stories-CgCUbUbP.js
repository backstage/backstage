import{j as t,U as p,V as c,W as l,m as i,a0 as d}from"./iframe-DA79yDb5.js";import{s as g,H as u}from"./plugin-Pizw1Yp2.js";import{c as h}from"./api-HfqloE_f.js";import{c as f}from"./catalogApiMock-P_b9LM88.js";import{s as x}from"./api-Q_UaGI12.js";import{S as y}from"./SearchContext-DzLP-t5m.js";import{P as S}from"./Page-DjSJbwYd.js";import{S as r}from"./Grid-BPnxYFEE.js";import{b as k,a as j,c as C}from"./plugin-DPO0j2JD.js";import{T as P}from"./TemplateBackstageLogo-emdCjGb4.js";import{T as I}from"./TemplateBackstageLogoIcon-aRlfPf9z.js";import{e as T}from"./routes-BxOBnJ17.js";import{w as v}from"./appWrappers-n6jVhqF6.js";import{s as G}from"./StarredEntitiesApi-BW6upxRZ.js";import{M as A}from"./MockStarredEntitiesApi-CpE46KLz.js";import{I as B}from"./InfoCard-DXBo22iI.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C7jcciOT.js";import"./Plugin-CYrkOIGL.js";import"./componentData-Cd7zESh7.js";import"./useAnalytics-C702rZt-.js";import"./useApp-PXZC3w6P.js";import"./useRouteRef-Vppi1dhZ.js";import"./index-Yr_6lw0r.js";import"./lodash-DGzVoyEp.js";import"./ref-C0VTUPuL.js";import"./useAsync-DJl5sWtJ.js";import"./useMountedState-3oFHoVCv.js";import"./DialogTitle-Cam7H8C2.js";import"./Modal-B60MXtNN.js";import"./Portal-C0jNS9Vb.js";import"./Backdrop-CHWN49VN.js";import"./Button-DhPtekNk.js";import"./useObservable-C8gw3qun.js";import"./useIsomorphicLayoutEffect-Bv5BjMnP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-DSz4cfwc.js";import"./ErrorBoundary-D_GuCvAD.js";import"./ErrorPanel-Cep-pimB.js";import"./WarningPanel-BYActx0S.js";import"./ExpandMore-DR_zyoTC.js";import"./AccordionDetails-BvhTDe-h.js";import"./index-B9sM2jn7.js";import"./Collapse-Cl5eVhLP.js";import"./MarkdownContent-GLKDok0W.js";import"./CodeSnippet-CVIRDvuJ.js";import"./Box-BVQ5Vy1y.js";import"./styled-BjxYaA7M.js";import"./CopyTextButton-BbvOylv0.js";import"./useCopyToClipboard-BnMS7Zdt.js";import"./Tooltip-DjxuUc5H.js";import"./Popper-Vz_SQ7W_.js";import"./List-nEGPw4NA.js";import"./ListContext-kCBY5dMI.js";import"./ListItem-BvihMH8Z.js";import"./ListItemText-DGxuZd8I.js";import"./LinkButton-C7Vx68WK.js";import"./Link-QsBbL45G.js";import"./CardHeader-BBlm1V9W.js";import"./Divider-CFY8fi3w.js";import"./CardActions-C6lGtMc4.js";import"./BottomLink-Bj6NYPog.js";import"./ArrowForward-2Mv1uxa3.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Ft={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":T}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(I,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
