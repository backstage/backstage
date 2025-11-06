import{j as t,m as d,I as u,b as h,T as g}from"./iframe-D4YkWMPd.js";import{r as x}from"./plugin-DbSWKguG.js";import{S as m,u as n,a as S}from"./useSearchModal-D8F6ieN8.js";import{B as c}from"./Button-bLTRgJ4c.js";import{a as f,b as M,c as j}from"./DialogTitle-ikIQGFRt.js";import{B as C}from"./Box-CrXhOgBb.js";import{S as r}from"./Grid-3dbGowTG.js";import{S as y}from"./SearchType-CjB6CRx5.js";import{L as I}from"./List-DbiJVjlG.js";import{H as R}from"./DefaultResultListItem-GulaYxE6.js";import{s as B,M as D}from"./api-DzNVbBJY.js";import{S as T}from"./SearchContext-BiwAE7eM.js";import{w as k}from"./appWrappers-BdS3ZXd0.js";import{SearchBar as v}from"./SearchBar-BDnb8mj9.js";import{a as b}from"./SearchResult-C5Gy_f4c.js";import"./preload-helper-D9Z9MdNV.js";import"./index-DcRSVOOI.js";import"./Plugin-CS5_JnCA.js";import"./componentData-C4oKpH_t.js";import"./useAnalytics--ii2Xnv1.js";import"./useApp-BYOY4yJv.js";import"./useRouteRef-Dr-zIQ4_.js";import"./index-Cb5ApCX3.js";import"./ArrowForward-ZRQV-YG0.js";import"./translation-XSJ4LSrS.js";import"./Page-CCRPxgYC.js";import"./useMediaQuery-A7vHSOhn.js";import"./Divider-DoiUQK47.js";import"./ArrowBackIos-CkeJGWYk.js";import"./ArrowForwardIos-CnKmkf2G.js";import"./translation-B4keq2Eo.js";import"./Modal-BPzxcCH2.js";import"./Portal-GmGr81qv.js";import"./Backdrop-BWtXXt1T.js";import"./styled-dYo-GhGI.js";import"./ExpandMore-Bpioo4yy.js";import"./useAsync-DFwDLbfT.js";import"./useMountedState-BZeJdOiH.js";import"./AccordionDetails-DKrusFPL.js";import"./index-DnL3XN75.js";import"./Collapse-CyHojAhw.js";import"./ListItem-C4617hHA.js";import"./ListContext-C8PRUhDY.js";import"./ListItemIcon-Ce9KgSHe.js";import"./ListItemText-C8w1SX_U.js";import"./Tabs-DYyOjf06.js";import"./KeyboardArrowRight-BFL6nDmi.js";import"./FormLabel-BYcqQo28.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B7C4jEin.js";import"./InputLabel-CzOloBn8.js";import"./Select-BhFottL8.js";import"./Popover-Dw74DHDI.js";import"./MenuItem-v5Mx3ggq.js";import"./Checkbox-BeoC-0jR.js";import"./SwitchBase-CuC476wl.js";import"./Chip-BD0NcoVz.js";import"./Link-Cg_HU4j2.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-DbwS_JUV.js";import"./useIsomorphicLayoutEffect-CKq4zRUd.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-BJxGg-t4.js";import"./useDebounce-B4V2tl_g.js";import"./InputAdornment-QqQbGI3Q.js";import"./TextField-CBSTYjvN.js";import"./useElementFilter-BajLCaw4.js";import"./EmptyState-DGtqJW4Z.js";import"./Progress-DWM47Cgj.js";import"./LinearProgress-zeJch42r.js";import"./ResponseErrorPanel-B-KKyMdC.js";import"./ErrorPanel-geXzwKYb.js";import"./WarningPanel-CPZUUyuU.js";import"./MarkdownContent-DNug9PDQ.js";import"./CodeSnippet-Dl0gP_YZ.js";import"./CopyTextButton-GQ6DbX_U.js";import"./useCopyToClipboard-CXAMfyh-.js";import"./Tooltip-BBJrGxop.js";import"./Popper-BtazmgWL.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
