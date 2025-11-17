import{j as t,m as d,I as u,b as h,T as g}from"./iframe-CIM5duhm.js";import{r as x}from"./plugin-CLcfz4RH.js";import{S as m,u as n,a as S}from"./useSearchModal-Dj_unFzl.js";import{B as c}from"./Button-qnzTC3D6.js";import{a as f,b as M,c as j}from"./DialogTitle-C7x4V4Yo.js";import{B as C}from"./Box-BD8Uu_7H.js";import{S as r}from"./Grid-Duc3jmgA.js";import{S as y}from"./SearchType-s-TjPxy9.js";import{L as I}from"./List-CGOBvW-t.js";import{H as R}from"./DefaultResultListItem-DLhwsFX5.js";import{s as B,M as D}from"./api-Bslp_G49.js";import{S as T}from"./SearchContext-Gzflvs0o.js";import{w as k}from"./appWrappers-C9XZWfKp.js";import{SearchBar as v}from"./SearchBar-DbDi6jrV.js";import{a as b}from"./SearchResult-hfztOhEZ.js";import"./preload-helper-D9Z9MdNV.js";import"./index-DgwYc68S.js";import"./Plugin-BahgJ1_U.js";import"./componentData-CysmgvuR.js";import"./useAnalytics-BRyHidSV.js";import"./useApp-DECMHJKF.js";import"./useRouteRef-BRIN7ftV.js";import"./index-eXSQF74E.js";import"./ArrowForward-Di3FBZA_.js";import"./translation-zTj9lAz0.js";import"./Page-CnqwYXFK.js";import"./useMediaQuery-Ed1BqGn2.js";import"./Divider-DA-kCS2y.js";import"./ArrowBackIos-BfHxm8y9.js";import"./ArrowForwardIos-DVbJo2jz.js";import"./translation-Mg0wxjS2.js";import"./Modal-CTawIxqI.js";import"./Portal-6z5sMs7a.js";import"./Backdrop-ktCLmDIR.js";import"./styled-Co6KhZ4u.js";import"./ExpandMore-D2DOioK9.js";import"./useAsync-BVaj5mJ5.js";import"./useMountedState-BMP6C5TD.js";import"./AccordionDetails-D4PSfG9Y.js";import"./index-DnL3XN75.js";import"./Collapse-BWkOwJIQ.js";import"./ListItem-C8QkAD_t.js";import"./ListContext-BKDMM4_S.js";import"./ListItemIcon-DLWEhI4p.js";import"./ListItemText-BZPfuyb-.js";import"./Tabs-BQSWQJ5H.js";import"./KeyboardArrowRight-DZKFtyLW.js";import"./FormLabel-CuaxJ3_s.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CqwH1Vk0.js";import"./InputLabel-CFyjP1Jo.js";import"./Select-Ba1SeKF4.js";import"./Popover-B59RL4fp.js";import"./MenuItem-CDmTRL41.js";import"./Checkbox-DiGgPqcE.js";import"./SwitchBase-CCvWjkg4.js";import"./Chip-BM8GRuCG.js";import"./Link-DCWBCw0R.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-phC6TcCN.js";import"./useIsomorphicLayoutEffect-CFVY4_Ue.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-vbkGLQub.js";import"./useDebounce-hQobn0y2.js";import"./InputAdornment-DH0gmLeW.js";import"./TextField-BQnj7Vet.js";import"./useElementFilter-BYCU1PRW.js";import"./EmptyState-C_SssmXd.js";import"./Progress-ClQKxc2a.js";import"./LinearProgress-CI_prkB1.js";import"./ResponseErrorPanel-Bur4Xeqn.js";import"./ErrorPanel-CfBA3Rnk.js";import"./WarningPanel-4pT00iVw.js";import"./MarkdownContent-C54rNlBp.js";import"./CodeSnippet-C2ptadrL.js";import"./CopyTextButton-DEGdjETq.js";import"./useCopyToClipboard-CcN5gAoC.js";import"./Tooltip-DHuqselR.js";import"./Popper-Bdhv-Ri7.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
