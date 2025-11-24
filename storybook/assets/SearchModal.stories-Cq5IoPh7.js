import{j as t,m as d,I as u,b as h,T as g}from"./iframe-CJzL4cPn.js";import{r as x}from"./plugin-D2nWyMkh.js";import{S as m,u as n,a as S}from"./useSearchModal-D1q0bsLp.js";import{B as c}from"./Button-BDjrXKRV.js";import{a as f,b as M,c as j}from"./DialogTitle-CVZcsTa6.js";import{B as C}from"./Box-Csalpl_F.js";import{S as r}from"./Grid-BQVDj5Jb.js";import{S as y}from"./SearchType-CF6BWe4X.js";import{L as I}from"./List-BYbAdUIJ.js";import{H as R}from"./DefaultResultListItem-CCkCGnoC.js";import{s as B,M as D}from"./api-D6FmelBo.js";import{S as T}from"./SearchContext-DohUNuhv.js";import{w as k}from"./appWrappers-t7jUGClR.js";import{SearchBar as v}from"./SearchBar-AhcfRUtP.js";import{a as b}from"./SearchResult-BZHo9cyz.js";import"./preload-helper-D9Z9MdNV.js";import"./index-CzvWtn5D.js";import"./Plugin-T9LhbTpw.js";import"./componentData-Bxo0opjl.js";import"./useAnalytics-BPOXrxOI.js";import"./useApp-B-72fomi.js";import"./useRouteRef-C2SQIqLl.js";import"./index-DOHES8EM.js";import"./ArrowForward-Z4Kc94IP.js";import"./translation-DGGPO3vf.js";import"./Page-DdP_262g.js";import"./useMediaQuery-B6iTZuff.js";import"./Divider-BE8z6uet.js";import"./ArrowBackIos-FdbYWjbq.js";import"./ArrowForwardIos-D37yvQ9M.js";import"./translation-CEMJyAsS.js";import"./Modal-1aP5x17K.js";import"./Portal-ySyRj64n.js";import"./Backdrop-gfzpOR42.js";import"./styled-f8cp2BHL.js";import"./ExpandMore-CmjptgVe.js";import"./useAsync-BSNRfxTI.js";import"./useMountedState-B45YxSq3.js";import"./AccordionDetails-BotIVLWW.js";import"./index-DnL3XN75.js";import"./Collapse-DsMTKxQW.js";import"./ListItem-KhwlQec0.js";import"./ListContext-BHz-Qyxa.js";import"./ListItemIcon-CTSQ3CDI.js";import"./ListItemText-B_NH5e14.js";import"./Tabs-BrV5B0qa.js";import"./KeyboardArrowRight-C9I2xs85.js";import"./FormLabel-BdJVzTF4.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Di4nVdks.js";import"./InputLabel-Dsdf4i3I.js";import"./Select-DIPzd_nu.js";import"./Popover-DfyH4ojT.js";import"./MenuItem-B_k5kJ9V.js";import"./Checkbox-QPl8g3l_.js";import"./SwitchBase-D-iCpS1h.js";import"./Chip-DgqhWnUU.js";import"./Link-bUQVVVBw.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-CavGCRyy.js";import"./useIsomorphicLayoutEffect-CudT8Pcz.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-DECg7PA7.js";import"./useDebounce-BEHtDbzn.js";import"./InputAdornment-DpclFeul.js";import"./TextField-B7gLx0sy.js";import"./useElementFilter-C2V4XNZa.js";import"./EmptyState-Czi6BsCL.js";import"./Progress-BKjRG_zv.js";import"./LinearProgress-BtqyN3Ir.js";import"./ResponseErrorPanel-Cxetwe6-.js";import"./ErrorPanel-GfXZ_B1c.js";import"./WarningPanel-BI6WRQPV.js";import"./MarkdownContent-C8HtueuI.js";import"./CodeSnippet-CXtB-eI-.js";import"./CopyTextButton-CsNMp3PI.js";import"./useCopyToClipboard-PlMsdEl8.js";import"./Tooltip-DPXqpdcr.js";import"./Popper-DeiYwaxg.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
