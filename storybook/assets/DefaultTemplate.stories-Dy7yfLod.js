import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-BooBp-Po.js";import{s as g,H as u}from"./plugin-BF6HMdmX.js";import{c as h}from"./api-BCU6vb-_.js";import{c as f}from"./catalogApiMock-DcfB-I0H.js";import{s as x}from"./api-Dw2e48Gs.js";import{S as y}from"./SearchContext-DDJFifE2.js";import{P as S}from"./Page-Dc6p_H7A.js";import{S as r}from"./Grid-DyVJyHQ5.js";import{b as k,a as j,c as C}from"./plugin-CCaDKLYY.js";import{T as P}from"./TemplateBackstageLogo-eJkn5_Cg.js";import{T}from"./TemplateBackstageLogoIcon-DIRXz3UO.js";import{e as I}from"./routes-Cva62O9U.js";import{w as v}from"./appWrappers-CTUrCtOx.js";import{s as G}from"./StarredEntitiesApi-g7zVy5_Z.js";import{M as A}from"./MockStarredEntitiesApi-DoO8XfTT.js";import{I as B}from"./InfoCard-DIPvFOR7.js";import"./preload-helper-PPVm8Dsz.js";import"./index-yX-uEimB.js";import"./Plugin-B6z4Q4HB.js";import"./componentData-UC---0ba.js";import"./useAnalytics-B6NIIYQR.js";import"./useApp-BELQ6JvB.js";import"./useRouteRef-C16BXt-W.js";import"./index-uVUaDJuf.js";import"./ref-C0VTUPuL.js";import"./lodash-DLuUt6m8.js";import"./useAsync-BkydaeDo.js";import"./useMountedState-BZIVYzWq.js";import"./DialogTitle-CrfKXT0M.js";import"./Modal-cDnVm_jG.js";import"./Portal-TbQYoDFY.js";import"./Backdrop-B9Tcq6ce.js";import"./Button-Cv3OLp_n.js";import"./useObservable-NJCYJyLg.js";import"./useIsomorphicLayoutEffect-BOg_mT4I.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-C0i9nHGG.js";import"./ErrorBoundary-D5Pk8kNF.js";import"./ErrorPanel-J8VMJBUn.js";import"./WarningPanel-Df9ZONi2.js";import"./ExpandMore-Bspz5IQW.js";import"./AccordionDetails-DxggSv3D.js";import"./index-B9sM2jn7.js";import"./Collapse-CmSq19t6.js";import"./MarkdownContent-BDjlG_JM.js";import"./CodeSnippet-L6pub6pc.js";import"./Box-obs2E8MU.js";import"./styled-DJvGKcz3.js";import"./CopyTextButton-CtUqznh5.js";import"./useCopyToClipboard-B64G66d9.js";import"./Tooltip-C6PmnGP2.js";import"./Popper-m5liQdCd.js";import"./List-Cb7k0m_f.js";import"./ListContext-5jNT-Bcm.js";import"./ListItem-CUDBczQT.js";import"./ListItemText-Bjf3smxb.js";import"./LinkButton-DpHtnVgU.js";import"./Link-6ZJtYR0w.js";import"./CardHeader-DbBll6nT.js";import"./Divider-k2YJ45XN.js";import"./CardActions-CisRazDZ.js";import"./BottomLink-fNgaEPxJ.js";import"./ArrowForward-B0hk3RK2.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
