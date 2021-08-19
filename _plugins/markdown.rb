class Kramdown::Converter::Html
  def convert_table(el, indent)
    # Converts table to responsive Bootstrap table.

    el.attr["class"] ||= 'table'

    "<div class=\"table-responsive\">" + \
    format_as_indented_block_html(el.type, el.attr, inner(el, indent), indent) + \
    "</div>"
  end
end