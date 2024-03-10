from datetime import datetime

from dateutil.relativedelta import relativedelta


def subtract_months_from_date(original_date, months_to_subtract):

    new_date = original_date - relativedelta(months=months_to_subtract)

    return new_date

def months_until_current_date(start_date):
    current_date = datetime.now().date()

    difference = relativedelta(current_date, start_date)

    total_months = difference.years * 12 + difference.months

    return total_months