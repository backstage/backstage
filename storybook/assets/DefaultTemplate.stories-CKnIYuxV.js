import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-CIM5duhm.js";import{s as g,H as u}from"./plugin-CLcfz4RH.js";import{c as h}from"./api-BmCfVvZO.js";import{c as f}from"./catalogApiMock-CIRNQYDs.js";import{s as x}from"./api-Bslp_G49.js";import{S as y}from"./SearchContext-Gzflvs0o.js";import{P as S}from"./Page-Dn6BE-oL.js";import{S as r}from"./Grid-Duc3jmgA.js";import{b as k,a as j,c as C}from"./plugin-D9ar44j_.js";import{T as P}from"./TemplateBackstageLogo-D19pBo5l.js";import{T}from"./TemplateBackstageLogoIcon-BVfBqTeq.js";import{e as I}from"./routes-fWmMgHE5.js";import{w as v}from"./appWrappers-C9XZWfKp.js";import{s as G}from"./StarredEntitiesApi-l5I_mQ35.js";import{M as A}from"./MockStarredEntitiesApi-BNLfpqG6.js";import{I as B}from"./InfoCard-DYfoP3uw.js";import"./preload-helper-D9Z9MdNV.js";import"./index-DgwYc68S.js";import"./Plugin-BahgJ1_U.js";import"./componentData-CysmgvuR.js";import"./useAnalytics-BRyHidSV.js";import"./useApp-DECMHJKF.js";import"./useRouteRef-BRIN7ftV.js";import"./index-eXSQF74E.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-BVaj5mJ5.js";import"./useMountedState-BMP6C5TD.js";import"./DialogTitle-C7x4V4Yo.js";import"./Modal-CTawIxqI.js";import"./Portal-6z5sMs7a.js";import"./Backdrop-ktCLmDIR.js";import"./Button-qnzTC3D6.js";import"./useObservable-phC6TcCN.js";import"./useIsomorphicLayoutEffect-CFVY4_Ue.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-Y_6Qe422.js";import"./ErrorBoundary-DW2AFmmD.js";import"./ErrorPanel-CfBA3Rnk.js";import"./WarningPanel-4pT00iVw.js";import"./ExpandMore-D2DOioK9.js";import"./AccordionDetails-D4PSfG9Y.js";import"./index-DnL3XN75.js";import"./Collapse-BWkOwJIQ.js";import"./MarkdownContent-C54rNlBp.js";import"./CodeSnippet-C2ptadrL.js";import"./Box-BD8Uu_7H.js";import"./styled-Co6KhZ4u.js";import"./CopyTextButton-DEGdjETq.js";import"./useCopyToClipboard-CcN5gAoC.js";import"./Tooltip-DHuqselR.js";import"./Popper-Bdhv-Ri7.js";import"./List-CGOBvW-t.js";import"./ListContext-BKDMM4_S.js";import"./ListItem-C8QkAD_t.js";import"./ListItemText-BZPfuyb-.js";import"./LinkButton-c10FrtBS.js";import"./Link-DCWBCw0R.js";import"./CardHeader-AaChVV2H.js";import"./Divider-DA-kCS2y.js";import"./CardActions-LQToxJMs.js";import"./BottomLink-B0RwdjBb.js";import"./ArrowForward-Di3FBZA_.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
