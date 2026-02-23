import{j as t,W as u,K as p,X as g}from"./iframe-CT0kqbtx.js";import{r as h}from"./plugin-DmJoezfQ.js";import{S as l,u as c,a as x}from"./useSearchModal-D8DssT9l.js";import{s as S,M}from"./api-DIsr2-jB.js";import{S as C}from"./SearchContext-Mmvk1abL.js";import{B as m}from"./Button-zP28n0U_.js";import{m as f}from"./makeStyles-DcVFc7tY.js";import{D as j,a as y,b as B}from"./DialogTitle-CVz8MpwV.js";import{B as D}from"./Box-D9dg6CgS.js";import{S as n}from"./Grid-BDVcufVA.js";import{S as I}from"./SearchType-Cw_1lB2A.js";import{L as G}from"./List-CI6msm6Y.js";import{H as R}from"./DefaultResultListItem-BXPXb8RW.js";import{w as k}from"./appWrappers-DqGnnVBb.js";import{SearchBar as v}from"./SearchBar-eKeU7QoS.js";import{S as T}from"./SearchResult-rKQiFdFr.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BymOnCk-.js";import"./Plugin-Cy4CmITj.js";import"./componentData-B6F2nED4.js";import"./useAnalytics-Cwz45vQ0.js";import"./useApp-B6I2yL-o.js";import"./useRouteRef-8ouUj60l.js";import"./index-BogYrcCc.js";import"./ArrowForward-BmNdwBsR.js";import"./translation-Bhp6G1Xw.js";import"./Page-DnI5PQWA.js";import"./useMediaQuery-CHEVb_cA.js";import"./Divider-5fIY8kRf.js";import"./ArrowBackIos-Dh3ZWMgk.js";import"./ArrowForwardIos-C244DJPu.js";import"./translation-CLuk9WYr.js";import"./lodash-BBZYXrTl.js";import"./useAsync-BNL7GVzz.js";import"./useMountedState-uZD7XVdG.js";import"./Modal-Il3Pl7UL.js";import"./Portal-BtLj93zy.js";import"./Backdrop-DfAj9kIE.js";import"./styled-BLkpW3Mf.js";import"./ExpandMore-6HFBoBc1.js";import"./AccordionDetails-CRkm3t8h.js";import"./index-B9sM2jn7.js";import"./Collapse-KXSsxD0x.js";import"./ListItem-C8Yqw-7T.js";import"./ListContext-CFe7K_lB.js";import"./ListItemIcon-BxgRbrR9.js";import"./ListItemText-BCOqMdhs.js";import"./Tabs-CgKVHsIQ.js";import"./KeyboardArrowRight-D9gaHD2B.js";import"./FormLabel-C84PWemP.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BIYrfHLt.js";import"./InputLabel-BAdNWiVD.js";import"./Select-BCZtDEeR.js";import"./Popover-DV6slOQA.js";import"./MenuItem-B30-uMaf.js";import"./Checkbox-DzZNflD2.js";import"./SwitchBase-5EJR_E-c.js";import"./Chip-Di-PmDGj.js";import"./Link-BfoO4-Ib.js";import"./index-yu5cIKNC.js";import"./useObservable-DPa0kBqA.js";import"./useIsomorphicLayoutEffect-D0Q3L9Ht.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Bwfpmnf1.js";import"./useDebounce-REgkGx5c.js";import"./InputAdornment-2iGAS4ex.js";import"./TextField-BRUVaSB6.js";import"./useElementFilter-D5kKtn5Q.js";import"./EmptyState-DsKZk04Z.js";import"./Progress-BSlEnHbY.js";import"./LinearProgress-WoHtrikV.js";import"./ResponseErrorPanel-Ds6L1xfj.js";import"./ErrorPanel-DZVPlRt5.js";import"./WarningPanel-DNkgwpiJ.js";import"./MarkdownContent-BQtSG_5P.js";import"./CodeSnippet-CsmjN4xv.js";import"./CopyTextButton-CKXai8-6.js";import"./useCopyToClipboard-mQ9yCfQF.js";import"./Tooltip-w_fvyE_G.js";import"./Popper-DfZHcMCo.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
